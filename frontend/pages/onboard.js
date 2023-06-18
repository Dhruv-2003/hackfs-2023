import Image from "next/image";
import React from "react";
import avatar from "../public/avatar.gif";

function Onboard() {
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
                  <p className="text-xl text-indigo-400">Your unique username</p>
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
            <button className="px-10 bg-white text-violet-400 rounded-xl py-2 text-xl border font-semibold hover:scale-105 hover:bg-violet-400 hover:text-white hover:border-white">Proceed</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboard;
