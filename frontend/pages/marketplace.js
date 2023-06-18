import React from "react";
import NftGallery from "../components/nftGallery";

const Marketplace = () => {
  return (
    <div>
      <div className="flex flex-col justify-center">
        <div className="mx-auto mt-5 text-3xl text-violet-400">
          <p>Marketplace for ARK IDS</p>
        </div>
      <NftGallery
        collectionAddress={"0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"}
        chain={"ETH_MAINNET"}
      ></NftGallery>
      </div>
    </div>
  );
};

export default Marketplace;
