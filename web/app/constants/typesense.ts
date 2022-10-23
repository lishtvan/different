export const LISTINGS_COLLECTION_NAME = "listings";
export const getTypesenseConfig = ({
  isWriteConfig,
}: {
  isWriteConfig: boolean;
}) => ({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST!!,
      port: process.env.ENVIRONMENT === "local" ? 8108 : 443,
      protocol: process.env.ENVIRONMENT === "local" ? "http" : "https",
    },
  ],
  apiKey: isWriteConfig
    ? process.env.TYPESENSE_WRITE_API_KEY!!
    : process.env.TYPESENSE_SEARCH_API_KEY!!,
});
