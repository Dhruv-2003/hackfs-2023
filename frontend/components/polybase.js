import { Polybase } from "@polybase/client";
import * as eth from "@polybase/eth";
import { toHex } from "viem";

const db = new Polybase({
  defaultNamespace:
    "pk/0xf868433a12a9d57e355176a00ee6b5c80ed1fe2c939d81062e0251081994f039d1ce57a55e66571da21ef0466200304dfb18ad7200533c44e83a036b5c088a42/ARK",
});

export const createArkIdRecord = async (
  pkpWallet,
  ArkTokenId,
  userName,
  email,
  erc6551Acc
) => {
  db.signer(async (data) => {
    const msg = toHex(data);
    const sig = await pkpWallet.signMessage(msg);

    return { h: "eth-personal-sign", sig };
  });

  const pkpAddress = pkpWallet.getAddress();
  // for constructor   creating collection record
  await db
    .collection("ArkID")
    .create([ArkTokenId, userName, email, pkpAddress, erc6551Acc]);

  await db.collection("ArkRecord").create([pkpAddress, userName, ArkTokenId]);
};

export const createGame = async (
  pkpWallet,
  gameId,
  gameName,
  gameURI,
  assetColAddress
) => {
  db.signer(async (data) => {
    const msg = toHex(data);
    const sig = await pkpWallet.signMessage(msg);

    return { h: "eth-personal-sign", sig };
  });

  // for constructor   creating collection record
  await db
    .collection("Game")
    .create([gameId, gameName, gameURI, assetColAddress]);
};

export const createChallenge = async (
  pkpWallet,
  challengeId,
  challengeName,
  challengeDesc,
  xpAward
) => {
  db.signer(async (data) => {
    const msg = toHex(data);
    const sig = await pkpWallet.signMessage(msg);

    return { h: "eth-personal-sign", sig };
  });

  // for constructor   creating collection record
  await db
    .collection("Challenge")
    .create([challengeId, challengeName, challengeDesc, xpAward]);
};

export const addXp = async (pkpWallet, xpToAdd) => {
  db.signer(async (data) => {
    const msg = toHex(data);
    const sig = await pkpWallet.signMessage(msg);

    return { h: "eth-personal-sign", sig };
  });

  await db.collection("ArkID").call("addXp", [xpToAdd]);
};

export const assignTier = async (pkpWallet, TierName) => {
  db.signer(async (data) => {
    const msg = toHex(data);
    const sig = await pkpWallet.signMessage(msg);

    return { h: "eth-personal-sign", sig };
  });

  await db.collection("ArkID").call("assignTier", [TierName]);
};

export const addGame = async (pkpWallet, gameId) => {
  db.signer(async (data) => {
    const msg = toHex(data);
    const sig = await pkpWallet.signMessage(msg);

    return { h: "eth-personal-sign", sig };
  });

  const game = await db.collection("Game").record(gameId).get();
  await db.collection("ArkID").call("addGamesPlayed", [game]);
};

export const addChallenge = async (pkpWallet, challengeId) => {
  db.signer(async (data) => {
    const msg = toHex(data);
    const sig = await pkpWallet.signMessage(msg);

    return { h: "eth-personal-sign", sig };
  });

  const challenge = await db.collection("Challenge").record(challengeId).get();
  await db.collection("ArkID").call("addChallengePlayed", [challenge]);
};

const PolybaseUi = () => {
  const readRecord = async (pkpWallet, collection, recordId) => {
    db.signer(async (data) => {
      const msg = toHex(data);
      const sig = await pkpWallet.signMessage(msg);

      return { h: "eth-personal-sign", sig };
    });

    // for constructor   creating collection record
    await db.collection(collection).record("new-york").get();
    // await db.collection(collection).record(recordId).get();
  };

  return (
    <div>
      <button onClick={createDB}>create db</button>
    </div>
  );
};

export default PolybaseUi;

const createResponse = await db.applySchema(
  `
@public
collection NFTMetadata {
  id: string;
  name: string;
  description: 

  constructor (id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  setCountry (country: string) {
    this.country = country;
  }
}

@public
collection ARKDID {
  id: string;
  name: string;

  constructor (id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
`,
  ""
);
