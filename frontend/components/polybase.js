import { Polybase } from "@polybase/client";
import * as eth from "@polybase/eth"

const db = new Polybase({
  defaultNamespace:
    "pk/0xdd6503afa34792ca49abce644c46527bc2f664299797958e7780d21b4713a9698d35124fa269561f078f89c4aea969a862a20021f3f4042e1d5e5803817e28d3/hackfs",
});


const PolybaseUi = () => {

  const createDB = async () => {

    db.signer(async (data) => {
      // A permission dialog will be presented to the user
      const accounts = await eth.requestAccounts();
    
      // If there is more than one account, you may wish to ask the user which
      // account they would like to use
      const account = accounts[0];
    
      const sig = await eth.sign(data, account);
    
      return { h: "eth-personal-sign", sig };
    })
    
    // for constructor   creating collection record
    const collection = await db.collection("City").create(["new-york", "New York"]);
    // for functions    updating
    await db.collection("City").call("setCountry", ["USA"]);
    //for reading
    await db.collection("City").record("new-york").get();
  
  };

  return (
    <div>
      <button onClick={createDB}>create db</button>
    </div>
  )
}

export default PolybaseUi

// const createResponse = await db.applySchema(
//   `
// @public
  // collection City {
  //   id: string;
  //   name: string;
  //   country?: string;

  //   constructor (id: string, name: string) {
  //     this.id = id;
  //     this.name = name;
  //   }

  //   setCountry (country: string) {
  //     this.country = country;
  //   }
  // }

  // @public
  // collection Country {
  //   id: string;
  //   name: string;

  //   constructor (id: string, name: string) {
  //     this.id = id;
  //     this.name = name;
  //   }
  // }
// `,
//   "your-namespace"
// );

