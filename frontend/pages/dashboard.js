import Image from "next/image";
import React, { useState } from "react";
import avatar from "../public/avatar.gif";
import styles from "../styles/progressbar.module.css";

const Dashboard = () => {
  const [xp, setXp] = useState(2);
  const [codassets, setCodAssets] = useState([]);
  const [gta, setgta] = useState([]);
  const [challenges, setchallenges] = useState([]);
  return (
    <div>
      <div className="w-screen">
        <div className="flex flex-col mx-auto justify-center items-center">
          <div>
            <p className="text-white text-3xl mt-10">Dashboard</p>
          </div>
          <div className="w-2/3 xl:w-3/5 mt-20 flex flex-col">
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
                  <div className="flex justify-between w-full">
                    <div className="">
                      <p className="text-xl text-indigo-400">Name</p>
                      <p className="mt-2 text-white text-xl">hello</p>
                    </div>
                    <div className="">
                      <p className="text-xl text-indigo-400">username</p>
                      <p className="mt-2 text-white text-xl">hello</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-10 w-full">
                    <div className="">
                      <p className="text-xl text-indigo-400">Email-Id</p>
                      <p className="mt-2 text-white text-xl">hello</p>
                    </div>
                    <div className="">
                      <p className="text-xl text-indigo-400">Wallet Address</p>
                      <p className="text-white text-lg mt-2">hello</p>
                    </div>
                  </div>
                  <div className="flex flex-col mt-12">
                    <div className="w-full">
                      <p className="text-xl text-indigo-400">Player XP</p>
                    </div>
                    <div className="mt-6">
                      <div className={styles.progressbar}>
                        <div
                          style={{
                            width:
                              xp === 0
                                ? "20%"
                                : xp == 1
                                ? "40%"
                                : xp == 2
                                ? "60%"
                                : xp == 3
                                ? "80%"
                                : "100%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-8">
                    <div>
                      <p className="text-xl text-indigo-400">Tier</p>
                    </div>
                    <p className="text-xl text-white mt-2">Silver</p>
                  </div>
                </div>
                <div className="flex flex-col mt-8">
                  <div>
                    <p className="text-xl text-indigo-400">Assets</p>
                  </div>
                  <div className="w-full flex justify-between mt-5">
                    <p className="text-xl text-white">COD</p>
                    <p className="text-xl text-white">GTA 5</p>
                  </div>
                  <div className="w-full flex justify-between mt-5">
                    <div>
                      {codassets.map(() => {
                        return <div className="mt-4"></div>;
                      })}
                    </div>
                    <div>
                      {gta.map(() => {
                        return <div className="mt-4"></div>;
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-8">
                  <div>
                    <p className="text-xl text-indigo-400">Challenges</p>
                  </div>
                  <div className="">
                    {challenges.map(() => {
                      return <div className="mt-4"></div>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
