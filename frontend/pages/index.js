import Image from "next/image";
import hero from "../src/assets/img5.png";

export default function Home() {
  return (
    <main className="">
      
      <div className=" full-screen pt-24 px-6">
        <div className=" flex justify-around  items-center">
          <p>
            A Unified but decentralised platform for gamers and game developers
          </p>
          <div className=" max-w-md">
            <Image src={hero} />
          </div>
        </div>
      </div>
    </main>
  );
}
