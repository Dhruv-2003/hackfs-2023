import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace: "your-namespace",
});

const createResponse = await db.applySchema(`
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
`, 'your-namespace')