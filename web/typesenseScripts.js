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

// const schema = {
//   name: "listings",
//   fields: [
//     {
//       facet: false,
//       index: true,
//       name: "title",
//       optional: false,
//       type: "string",
//     },
//     {
//       facet: true,
//       index: true,
//       name: "designer",
//       optional: false,
//       type: "string",
//     },
//     {
//       facet: true,
//       index: true,
//       name: "tags",
//       optional: true,
//       type: "string[]",
//     },
//     {
//       facet: true,
//       index: true,
//       name: "size",
//       optional: false,
//       type: "string",
//     },
//     {
//       facet: true,
//       index: true,
//       name: "price",
//       optional: false,
//       type: "int32",
//     },
//     {
//       facet: true,
//       index: true,
//       name: "condition",
//       optional: false,
//       type: "string",
//     },
//     {
//       facet: true,
//       index: true,
//       name: "category",
//       optional: false,
//       type: "string",
//     },
//     {
//       facet: false,
//       index: false,
//       name: "imageUrls",
//       optional: true,
//       type: "string[]",
//     },
//     {
//       facet: true,
//       index: true,
//       name: "status",
//       optional: false,
//       type: "string",
//     },
//   ],
// };

// const deleteCollection = async () => {
//   try {
//     await typesense.collections(LISTINGS_COLLECTION_NAME).delete();
//   } catch (err) {
//     console.error(err);
//   }
// };

// const createCollection = async () => {
//   try {
//     await typesense.collections().create(schema);
//   } catch (err) {
//     console.error(err);
//   }
// };

const seed = async () => {
  const AVAILABLE = "AVAILABLE";
  try {
    let documents = [
      {
        id: "1",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "2",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "3",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "4",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "5",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "6",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "7",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "8",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "9",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "10",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "11",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "12",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "13",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "14",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "15",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "16",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "17",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "18",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "19",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "20",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "21",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "22",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "23",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "24",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "25",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "26",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "27",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "28",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "29",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "30",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
      },
      {
        id: "31",
        title: "Gucci glasses",
        designer: "Gucci",
        tags: ["#music"],
        category: "glasses",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "Used",
        price: 500,
        size: "ONE SIZE",
        status: AVAILABLE,
      },
      {
        id: "32",
        title: "T-shirt prada",
        designer: "Prada",
        tags: ["#vintage"],
        category: "T-shirts",
        imageUrls: [
          "https://s3.eu-central-1.amazonaws.com/different.dev/GwcpN13hTamAbjUYsElcSg-0",
        ],
        condition: "New with tags",
        price: 1400,
        size: "US XS / EU 42",
        status: AVAILABLE,
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

// deleteCollection();
// createCollection()
seed();
