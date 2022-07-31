export type Section =
  | "Tops"
  | "Bottoms"
  | "Outerwear"
  | "Footwear"
  | "Tailoring"
  | "Accessories";

type Categories = Record<Section, string[]>;

export const CATEGORIES: Categories = {
  Tops: [
    "T-shirts",
    "Long sleeve t-shirts",
    "Polo shirts",
    "Shirts button up",
    "Sweaters",
    "Hoodies",
    "Sweatshirts",
  ],
  Bottoms: [
    "Pants",
    "Cargo pants",
    "Jeans",
    "Shorts",
    "Cropped pants",
    "Track pants",
    "Overalls",
  ],
  Outerwear: [
    "Jackets",
    "Windbreakers",
    "Bomber jackets",
    "Leather jackets",
    "Parkas",
    "Denim jackets",
    "Coats",
    "Trenches",
    "Vests",
  ],
  Footwear: [
    "Sneakers",
    "Cotton sneakers",
    "Casual shoes",
    "Boots",
    "Sandals",
    "Slip-ons",
    "Flip-flops",
  ],
  Tailoring: ["Suits", "Blazers", "Suit pants", "Suit vests"],
  Accessories: [
    "Bags",
    "Belts",
    "Wallets",
    "Glasses",
    "Hats",
    "Casual hats",
    "Gloves",
    "Scarfs",
    "Ties",
    "Jewelry",
  ],
};
