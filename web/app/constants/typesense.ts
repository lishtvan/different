export const LISTINGS_COLLECTION_NAME = "listings";
export const getTypesenseConfig = () => ({
  nodes: [
    {
      host:
        process.env.ENVIRONMENT === "local"
          ? "127.0.0.1"
          : "xxx.a1.typesense.net",
      port: process.env.ENVIRONMENT === "local" ? 8108 : 443,
      protocol: process.env.ENVIRONMENT === "local" ? "http" : "https",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY!!,
});
