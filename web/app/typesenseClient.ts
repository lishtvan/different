import { TYPESENSE_CONFIG } from "./constants/typesense";
const Typesense = require("typesense");

export const typesense = new Typesense.Client(TYPESENSE_CONFIG);
