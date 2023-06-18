import Image from "next/image";
import React, { useEffect, useCallback } from "react";
import avatar from "../public/avatar.gif";
import { useLit } from "../context/litContext";
import { useRouter } from "next/router";
import { LitAuthClient, isSignInRedirect } from "@lit-protocol/lit-auth-client";
import { ProviderType, AuthMethodType } from "@lit-protocol/constants";

const REDIRECT_URI =
  process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/onboard";

function Onboard() {
  const router = useRouter();
  const { setAuthMethod, setProvider, handlePKPs, getSessionSig } = useLit();

  const litAuthClient = new LitAuthClient({
    litRelayConfig: {
      // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
      relayApiKey: "1234567890",
    },
  });

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

  useEffect(() => {
    // Check if app has been redirected from Lit login server
    // console.log(isSignInRedirect(REDIRECT_URI));
    if (isSignInRedirect(REDIRECT_URI)) {
      console.log(true);
      handleRedirect();
    } else {
      console.log(false);
    }
  }, [handleRedirect]);

  return (
    <div className="w-screen">
      <div className="flex flex-col mx-auto justify-center items-center">
        <div>
          <p className="text-white text-3xl mt-20">Join ARK</p>
        </div>
        <div className="w-2/3 xl:w-2/5 mt-20 flex flex-col">
          <div className="flex">
            <div className="w-1/3 justify-start">
              <Image
                src={avatar}
                alt="hello"
                className="rounded-full w-40 h-40"
              ></Image>
            </div>
            <div className="w-2/3 justify-end mx-12 mt-2">
              <div className="flex flex-col">
                <div className="w-full">
                  <p className="text-xl text-indigo-400">Your Name</p>
                  <input className="w-full mt-2 px-4 py-2 rounded-xl text-white"></input>
                </div>
                <div className="mt-10">
                  <p className="text-xl text-indigo-400">
                    Your unique username
                  </p>
                  <input className="w-full mt-2 px-4 py-2 rounded-xl text-white"></input>
                </div>
                <div className="mt-10">
                  <p className="text-xl text-indigo-400">Email-Id</p>
                  <input className="w-full mt-2 px-4 py-2 rounded-xl text-white"></input>
                </div>
                <div className="mt-10">
                  <p className="text-xl text-indigo-400">Wallet Address</p>
                  <p className="text-white text-lg mt-2">hello</p>
                </div>
              </div>
            </div>
          </div>
          <div className="justify-center items-center mx-auto mt-10">
            <button className="px-10 bg-white text-violet-400 rounded-xl py-2 text-xl border font-semibold hover:scale-105 hover:bg-violet-400 hover:text-white hover:border-white">
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboard;
