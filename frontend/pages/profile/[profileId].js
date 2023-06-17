import Image from "next/image";
import React from "react";
import gamer from "../../src/assets/gamer.webp";

export default function UserProfile() {
  return (
    <div>
      <div>
        <Image src={gamer} alt="user_profile" />
        <h1>Name</h1>
        <h4>UserName</h4>
        <h4>level</h4>
      </div>
      <div>
        <div>
          <h2>Tabs</h2>
          <div>Games Played</div>
          <div>Top Played Games</div>
          <div>Assets Owned</div>
        </div>
      </div>
    </div>
  );
}
