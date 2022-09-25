import type { SHORT_SIZES } from "~/constants/listing";

export type TListing = {
  imageUrls: string[];
  designer: string;
  size: keyof typeof SHORT_SIZES;
  title: string;
  price: number;
};
