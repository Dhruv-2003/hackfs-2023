import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
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

import { toHex, parseEther, createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";

const REDIRECT_URI =
  process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/onboard";

const RPC =
  process.env.NEXT_PUBLIC_RPC || "https://rpc.ankr.com/polygon_mumbai";

const LitContext = createContext();

export const useLit = () => {
  return useContext(LitContext);
};

export function LitProvider({ children }) {
  const [currentPKP, setCurrentPKP] = useState();
  const [sessionSigs, setSessionSigs] = useState();
  const [provider, setProvider] = useState();
  const [authMethod, setAuthMethod] = useState();
  const [pkpWallet, setpkpWallet] = useState();
  const router = useRouter();
  const client = createPublicClient({
    chain: polygonMumbai,
    transport: http(RPC),
  });

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
      redirectUri: REDIRECT_URI,
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
      redirectUri: REDIRECT_URI,
    });
    const authMethod = await provider.authenticate();
    console.log(authMethod);
    setAuthMethod(authMethod);
    setProvider(provider);
    handlePKPs(provider, authMethod);
  }, [router]);

  async function handlePKPs(provider, authMethod) {
    const res = await fetchPkp(provider, authMethod);
    if (res[0] == undefined) {
      mintPkp(provider, authMethod);
    } else {
      console.log(res[0]);
    }
  }

  async function fetchPkp(provider, authMethod) {
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

  async function mintPkp(provider, authMethod) {
    if (provider && authMethod) {
      const mintRes = await provider.mintPKPThroughRelayer(authMethod);
      console.log(mintRes);
    } else {
      console.log("Provider and Auth Method not Set");
    }
  }

  const getSessionSig = async () => {
    console.log(currentPKP);
    if (!currentPKP) {
      fetchPkp(provider, authMethod);
    }
    const authNeededCallback = async (authCallbackParams) => {
      const chainId = 137;
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
          chain: "polygon",
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

  async function signTransation() {}

  async function sendTransation() {}

  async function signMessage() {}

  const value = {
    authWithGoogle,
    handleRedirect,
    handlePKPs,
    getSessionSig,
    generatePKPWallet,
    pkpWallet,
    provider,
    sessionSigs,
    currentPKP,
    setAuthMethod,
    setProvider,
    setpkpWallet,
  };

  return <LitContext.Provider value={value}>{children}</LitContext.Provider>;
}
