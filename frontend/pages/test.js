import React, { useCallback, useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { LitAuthClient, isSignInRedirect } from "@lit-protocol/lit-auth-client";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { ProviderType, AuthMethodType } from "@lit-protocol/constants";
import { useRouter } from "next/router";

import * as LitJsSdk_accessControlConditions from "@lit-protocol/access-control-conditions";
import * as LitJsSdk_blsSdk from "@lit-protocol/bls-sdk";
import * as LitJsSdk_authHelpers from "@lit-protocol/auth-helpers";
import * as LitJsSdk_types from "@lit-protocol/types";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { PKPClient } from "@lit-protocol/pkp-client";

import { toHex, parseEther } from "viem";
import {
  useAccount,
  useWalletClient,
  usePublicClient,
  useNetwork,
} from "wagmi";
const REDIRECT_URI =
  process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/test";

const Test = () => {
  const router = useRouter();
  const publicClient = usePublicClient();
  const chainId = publicClient.getChainId();
  const { chain } = useNetwork();
  const [googleIdToken, setGoogleIdToken] = useState();
  const [pkps, setPKPs] = useState([]);
  const [currentPKP, setCurrentPKP] = useState();
  const [sessionSigs, setSessionSigs] = useState();
  const [provider, setProvider] = useState();
  const [authMethod, setAuthMethod] = useState();
  const [pkpWallet, setpkpWallet] = useState();
  const [pkpClient, setpkpClient] = useState(second);

  const litNodeClient = new LitNodeClient({
    litNetwork: "serrano",
    debug: true,
  });

  const litAuthClient = new LitAuthClient({
    litRelayConfig: {
      // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
      relayApiKey: "1234567890",
    },
  });

  async function authWithGoogle() {
    const provider = litAuthClient.initProvider(ProviderType.Google, {
      redirectUri: "http://localhost:3000/test",
    });
    // Initialize Google provider
    console.log("Start Google Signin");
    // const provider = litAuthClient.getProvider(ProviderType.Google);
    console.log(provider);
    await provider.signIn();
    setProvider(provider);
  }

  const handleRedirect = useCallback(async () => {
    // Get auth method object that has the OAuth token from redirect callback
    const provider = litAuthClient.initProvider(ProviderType.Google, {
      redirectUri: "http://localhost:3000/test",
    });
    const authMethod = await provider.authenticate();
    console.log(authMethod);
    setAuthMethod(authMethod);
    setProvider(provider);
  }, [router]);

  async function handlePKPs() {
    const res = fetchPkp();
    if (res[0] == undefined) {
      mintPkp();
    } else {
      console.log(res[0]);
    }
  }

  async function fetchPkp() {
    try {
      console.log(provider);
      console.log(authMethod);
      if (provider && authMethod) {
        const res = await provider.fetchPKPsThroughRelayer(authMethod);
        console.log(res);
        setCurrentPKP(res[0]);
        return res;
      } else {
        console.log("Provider and Auth Method not Set");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function mintPkp() {
    if (provider && authMethod) {
      const mintRes = await provider.mintPKPThroughRelayer(authMethod);
      console.log(mintRes);
    } else {
      console.log("Provider and Auth Method not Set");
    }
  }

  const getSessionSig = async () => {
    console.log(currentPKP);
    const authNeededCallback = async (authCallbackParams) => {
      console.log(authCallbackParams);
      let response = await litNodeClient.signSessionKey({
        authMethods: [
          {
            authMethodType: 7,
            accessToken: accessToken,
          },
        ],
        pkpPublicKey: currentPKP.publicKey,
        expiration: authCallbackParams.expiration,
        resources: authCallbackParams.resources,
        chainId,
      });

      return response.authSig;
    };

    try {
      await litNodeClient.connect();

      const litResource = new LitJsSdk_authHelpers.LitPKPResource(
        currentPKP.tokenId.hex
      );

      // const provider = litAuthClient.getProvider(ProviderType.Google);
      const sessionSigs = await provider.getSessionSigs({
        pkpPublicKey: currentPKP.publicKey,
        authMethod: {
          authMethodType: 6,
          accessToken: authMethod.accessToken,
        },
        sessionSigsParams: {
          chain: chain.name,
          resourceAbilityRequests: [
            {
              resource: litResource,
              ability: LitJsSdk_authHelpers.LitAbility.PKPSigning,
            },
          ],
          authNeededCallback,
        },
        litNodeClient,
      });
      console.log(sessionSigs);
      setSessionSigs(sessionSigs);
      generatePKPWallet(sessionSigs);
    } catch (e) {
      console.log(e);
      // setErr(e);
    }
  };

  async function generatePKPWallet(sessionSigs) {
    const pkpWallet = new PKPEthersWallet({
      controllerSessionSigs: sessionSigs,
      // Or you can also pass in controllerSessionSigs
      pkpPubKey: currentPKP.publicKey,
      rpc: "https://rpc.ankr.com/polygon_mumbai",
    });

    console.log(pkpWallet);
    setpkpWallet(pkpWallet);
  }

  async function signMessage() {
    console.log(pkpWallet);
    const from = "0x613b99C7b122b235C2Ba1426d3fC7Cf7Bf705381";
    const to = "0x62C43323447899acb61C18181e34168903E033Bf";
    const value = parseEther("0.01");
    const data = "0x";

    const transactionRequest = {
      from,
      to,
      value,
      data,
    };

    const message = "Free the web";
    const hexMsg = toHex(message);
    const sig = await pkpWallet.signMessage(hexMsg);
    console.log(sig);
    const signedTransactionRequest = await pkpWallet.signTransaction(
      transactionRequest
    );
    console.log(signedTransactionRequest);
    const tx = await pkpWallet.sendTransaction(signedTransactionRequest);
    console.log(tx);
  }

  useEffect(() => {
    // Check if app has been redirected from Lit login server
    if (isSignInRedirect(REDIRECT_URI)) {
      console.log(true);
      handleRedirect();
    }
  }, [handleRedirect]);

  return (
    <div>
      {/* <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      /> */}
      <button onClick={() => authWithGoogle()}>Start Signin</button>
      <button onClick={() => fetchPkp()}>Fetch PKP</button>
      <button onClick={() => mintPkp()}>Mint PKP</button>
      <button onClick={() => getSessionSig()}>Sign-in</button>
      <button onClick={() => signMessage()}>Sign msg</button>
    </div>
  );
};

export default Test;
