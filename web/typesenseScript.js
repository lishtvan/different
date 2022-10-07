// loadData.js
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

const schema = {
  name: "listings",
  fields: [
    {
      facet: false,
      index: true,
      name: "title",
      optional: false,
      type: "string",
    },
    {
      facet: true,
      index: true,
      name: "designer",
      optional: false,
      type: "string",
    },
    {
      facet: true,
      index: true,
      name: "tags",
      optional: true,
      type: "string[]",
    },
    {
      facet: true,
      index: true,
      name: "size",
      optional: false,
      type: "string",
    },
    {
      facet: true,
      index: true,
      name: "price",
      optional: false,
      type: "int32",
    },
    {
      facet: true,
      index: true,
      name: "condition",
      optional: false,
      type: "string",
    },
    {
      facet: true,
      index: true,
      name: "category",
      optional: false,
      type: "string",
    },
    {
      facet: false,
      index: false,
      name: "imageUrls",
      optional: true,
      type: "string[]",
    },
    {
      facet: true,
      index: true,
      name: "status",
      optional: false,
      type: "string",
    },
  ],
};

const deleteCollection = async () => {
  try {
    // const listings = await typesense
    //   .collections(LISTINGS_COLLECTION_NAME)
    //   .retrieve();
    // if (listings) {
    //   await typesense.collections(LISTINGS_COLLECTION_NAME).delete();
    // }

    await typesense.collections(LISTINGS_COLLECTION_NAME).delete();
  } catch (err) {
    console.error(err);
  }

  await typesense.collections().create(schema);
};

deleteCollection();
