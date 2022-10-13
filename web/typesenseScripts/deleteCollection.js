const Typesense = require("typesense");
const LISTINGS_COLLECTION_NAME = "listings";

const TYPESENSE_CONFIG = {
  nodes: [
    {
      host: "127.0.0.1",
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: "xyz",
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
