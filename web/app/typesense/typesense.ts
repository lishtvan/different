// loadData.js
const Typesense = require("typesense");
export const LISTINGS_COLLECTION_NAME = "listings";

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

export const typesense = new Typesense.Client(TYPESENSE_CONFIG);

export const createCollection = async () => {
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
        facet: false,
        index: true,
        name: "designer",
        optional: false,
        type: "string",
      },
      {
        facet: false,
        index: true,
        name: "tags",
        optional: true,
        type: "string[]",
      },
      {
        facet: false,
        index: true,
        name: "size",
        optional: false,
        type: "string",
      },
      {
        facet: false,
        index: true,
        name: "price",
        optional: false,
        type: "int32",
      },
      {
        facet: false,
        index: true,
        name: "condition",
        optional: false,
        type: "string",
      },
      {
        facet: false,
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
    ],
  };

  try {
    const listings = await typesense
      .collections(LISTINGS_COLLECTION_NAME)
      .retrieve();
    if (listings) {
      await typesense.collections(LISTINGS_COLLECTION_NAME).delete();
    }
  } catch (err) {
    console.error(err);
  }

  await typesense.collections().create(schema);
  console.log("Creating schema...");

  try {
    let documents = [
      {
        id: "1",
        title: "Gucci bag",
        designer: "Gucci",
        tags: "#vintage, #luxary",
      },
      {
        id: "2",
        title: "Prada glasses",
        designer: "Prada",
        tags: "#music",
      },
    ];
    await typesense
      .collections(LISTINGS_COLLECTION_NAME)
      .documents()
      .import(documents, { action: "create" });
  } catch (err) {
    console.error(err);
  }
};
