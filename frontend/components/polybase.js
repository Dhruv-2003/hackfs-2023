import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace:
    "pk/0xf868433a12a9d57e355176a00ee6b5c80ed1fe2c939d81062e0251081994f039d1ce57a55e66571da21ef0466200304dfb18ad7200533c44e83a036b5c088a42/ARK",
});

const createResponse = await db.applySchema(
  `
  @public
  collection CollectionName {
    id: string;
    name: string;
    country : {
        city: string,
        pincode: number
    };
    age?: number ,
    currency: map<string, number>

    constructor (id: string, country: string) {
      this.id = id;
      this.country = country;

      // Assign the public key of the user making the request to this record
      if (ctx.publicKey)
        this.publicKey = ctx.publicKey;
    }
    @index(name, age);
  }
`,
  "your-namespace"
);

const createCollectionRecord = await db
  .collection("City")
  .create(["new-york", "New York"]);
