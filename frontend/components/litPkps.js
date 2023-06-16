import * as LitJsSdk_accessControlConditions from "@lit-protocol/access-control-conditions";
import * as LitJsSdk_blsSdk from "@lit-protocol/bls-sdk";
import * as LitJsSdk_authHelpers from "@lit-protocol/auth-helpers";
import * as LitJsSdk_types from "@lit-protocol/types";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

class Lit {}

const RELAY_API_URL =
  process.env.NEXT_PUBLIC_RELAY_API_URL || "http://localhost:3001";

const handleMintPkpUsingGoogleAuth = async (credentialResponse, onSuccess) => {
  const requestId = await mintPkpUsingRelayerGoogleAuthVerificationEndpoint(
    credentialResponse
  );
  return pollRequestUntilTerminalState(requestId, onSuccess);
};

// 1. Mint the PKP for new user
// send the google Login Credential
async function mintPkpUsingRelayerGoogleAuthVerificationEndpoint(
  credentialResponse
) {
  const mintRes = await fetch(`${RELAY_API_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": "1234567890",
    },
    body: JSON.stringify({
      idToken: credentialResponse.credential,
    }),
  });

  if (mintRes.status < 200 || mintRes.status >= 400) {
    console.warn("Something wrong with the API call", await mintRes.json());
    return null;
  } else {
    const resBody = await mintRes.json();
    console.log("Response OK", { body: resBody });
    return resBody.requestId;
  }
}

async function pollRequestUntilTerminalState(
  requestId,
  setStatusFn,
  onSuccess
) {
  if (!requestId) {
    return;
  }

  const maxPollCount = 20;
  for (let i = 0; i < maxPollCount; i++) {
    setStatusFn(`Waiting for auth completion (poll #${i + 1})`);
    const getAuthStatusRes = await fetch(
      `${RELAY_API_URL}/auth/status/${requestId}`,
      {
        headers: {
          "api-key": "1234567890",
        },
      }
    );

    if (getAuthStatusRes.status < 200 || getAuthStatusRes.status >= 400) {
      console.warn(
        "Something wrong with the API call",
        await getAuthStatusRes.json()
      );
      return;
    }

    const resBody = await getAuthStatusRes.json();
    console.log("Response OK", { body: resBody });

    if (resBody.error) {
      // exit loop since error
      console.warn("Something wrong with the API call", {
        error: resBody.error,
      });

      return;
    } else if (resBody.status === "Succeeded") {
      // exit loop since success
      console.info("Successfully authed", { ...resBody });
      onSuccess({
        pkpEthAddress: resBody.pkpEthAddress,
        pkpPublicKey: resBody.pkpPublicKey,
      });
      return;
    }

    // otherwise, sleep then continue polling
    await new Promise((r) => setTimeout(r, 15000));
  }

  // at this point, polling ended and still no success, set failure status
  setStatusFn(`Hmm this is taking longer than expected...`);
}

// Connect to LitNode Client
async function getLitNodeClient() {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "serrano",
  });
  await litNodeClient.connect();

  return litNodeClient;
}

async function handleStoreEncryptionConditionNodes(googleCredentialResponse) {
  // get the user a session with it
  const litNodeClient = await getLitNodeClient();

  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    "this is a secret message"
  );

  // key parameter - encrypt symmetric key then hash it
  const encryptedSymmetricKey = LitJsSdk_blsSdk.wasmBlsSdkHelpers.encrypt(
    LitJsSdk.uint8arrayFromString(litNodeClient.subnetPubKey, "base16"),
    symmetricKey
  );

  // get the session sigs
  const { sessionSigs, authenticatedPkpPublicKey } = await getSessionSigs(
    litNodeClient,
    encryptedSymmetricKey,
    litNodeClient.generateAuthMethodForGoogleJWT(
      googleCredentialResponse.credential
    )
  );

  const pkpEthAddress = publicKeyToAddress(authenticatedPkpPublicKey);

  const unifiedAccessControlConditions =
    getUnifiedAccessControlConditions(pkpEthAddress);
  console.log(
    "unifiedAccessControlConditions: ",
    unifiedAccessControlConditions
  );

  // store the decryption conditions
  await litNodeClient.saveEncryptionKey({
    unifiedAccessControlConditions,
    symmetricKey,
    encryptedSymmetricKey,
    sessionSigs, // Not actually needed for storing encryption condition.
    chain: "ethereum",
  });

  console.log("encryptedSymmetricKey: ", encryptedSymmetricKey);

  return {
    encryptedSymmetricKey,
    encryptedString,
    authenticatedPkpPublicKey,
  };
}

async function getSessionSigs(encryptedSymmetricKey, authMethod) {
  let authenticatedPkpPublicKey;

  const litNodeClient = getLitNodeClient();

  // this will be fired if auth is needed. we can use this to prompt the user to sign in
  const authNeededCallback = async ({ resources, expiration, statement }) => {
    console.log("authNeededCallback fired");

    // Generate authMethod.
    const authMethods = [authMethod];

    // Get AuthSig
    const { authSig, pkpPublicKey } = await litNodeClient.signSessionKey({
      authMethods,
      statement,
      expiration:
        expiration || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
      resources: resources || [],
    });
    console.log("got session sig from node and PKP: ", {
      authSig,
      pkpPublicKey,
    });

    authenticatedPkpPublicKey = pkpPublicKey;

    return authSig;
  };

  //   const hashedEncryptedSymmetricKeyStr = await hashBytes({
  //     bytes: new Uint8Array(encryptedSymmetricKey),
  //   });

  const hashedEncryptedSymmetricKeyStr = await LitJsSdk.hashEncryptionKey({
    encryptedSymmetricKey,
  });

  // Construct the LitResource
  const litResource =
    new LitJsSdk_authHelpers.LitAccessControlConditionResource(
      hashedEncryptedSymmetricKeyStr
    );

  // Get the session sigs
  const sessionSigs = await litNodeClient.getSessionSigs({
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    chain: "ethereum",
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability:
          LitJsSdk_authHelpers.LitAbility.AccessControlConditionDecryption,
      },
    ],
    // resources: [`litEncryptionCondition://*`],
    // sessionCapabilityObject: {
    //   def: ["litEncryptionCondition"]
    // },
    switchChain: false,
    authNeededCallback,
  });
  console.log("sessionSigs: ", sessionSigs);
  console.log("authenticatedPkpPublicKey: ", authenticatedPkpPublicKey);

  return {
    sessionSigs,
    authenticatedPkpPublicKey: authenticatedPkpPublicKey,
  };
}

function publicKeyToAddress(publicKey) {
  return utils.computeAddress(`0x${publicKey}`);
}

async function hashBytes(bytes) {
  const hashOfBytes = await crypto.subtle.digest("SHA-256", bytes);
  const hashOfBytesStr = LitJsSdk.uint8arrayToString(
    new Uint8Array(hashOfBytes),
    "base16"
  );
  return hashOfBytesStr;
}

function getUnifiedAccessControlConditions(pkpEthAddress) {
  return [
    {
      conditionType: "evmBasic",
      contractAddress: "",
      standardContractType: "",
      chain: "mumbai",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: pkpEthAddress || "0x3c3CA2BFFfffE532aed2923A34D6c1F9307F8076",
      },
    },
  ];
}
