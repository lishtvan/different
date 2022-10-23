const Typesense = require("typesense");
const LISTINGS_COLLECTION_NAME = "listings";

const TYPESENSE_CONFIG = {
  nodes: [
    {
      host: "o2by0uh958xjn1igp-1.a1.typesense.net",
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: "2HrzvdCDAAk2kvCsRO8M0s9Gryork7Qv",
};

const typesense = new Typesense.Client(TYPESENSE_CONFIG);

const deleteCollection = async () => {
  try {
    await typesense.collections(LISTINGS_COLLECTION_NAME).delete();
  } catch (err) {
    console.error(err);
  }
};

deleteCollection();
