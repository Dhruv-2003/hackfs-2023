import Image from "next/image";
import React from "react";
import avatar from "../../src/assets/avatar.gif";
import * as Label from "@radix-ui/react-label";

export default function UserProfile() {
  return (
    <div className="min-h-[80vh]  my-auto flex flex-col gap-5 items-center justify-start  ">
      <div className=" mt-5 bg-gradient-to-bl from-indigo-300 to-purple-400 border py-20 rounded-2xl border-gray-600 grid grid-cols-3 mx-auto flex-wrap w-11/12 ">
        <div className=" ml-20  rounded-full">
          <Image
            className=" w-56 h-56 rounded-full "
            src={avatar}
            alt="avatar"
          />
        </div>
        <div className=" md:mx-20 my-auto text-lg font-bold tracking-wide">
          <div>GamerID</div>
          <div>XP:</div>
          <div>Badge</div>
        </div>
        <div className=" md:mx-20 my-auto text-lg font-bold tracking-wide">
          <a
            href="#_"
            className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
          >
            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
            <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
              Sell Account
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
