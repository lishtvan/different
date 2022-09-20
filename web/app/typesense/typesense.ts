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
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://different-s3-bucket.s3.amazonaws.com/o3d57h3SRnK0ifT2SjnGxA-3",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
      },
      {
        id: "2",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://different-s3-bucket.s3.amazonaws.com/o3d57h3SRnK0ifT2SjnGxA-3",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
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
