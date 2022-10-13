import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { TYPESENSE_CONFIG } from "./constants/typesense";
const Typesense = require("typesense");

export const typesenseClient = new Typesense.Client(TYPESENSE_CONFIG);
export const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
  server: {
    nodes: [
      {
        host: "localhost",
        port: 8108,
        protocol: "http",
      },
    ],
    apiKey: "xyz",
  },
  additionalSearchParameters: {
    query_by: "title,designer",
  },
});