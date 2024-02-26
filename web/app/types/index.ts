export type Env = "local" | "development" | "production";

export interface User {
  id: number;
  nickname: string;
  avatarUrl?: string;
  bio: string;
  location: string;
  phone?: string;
}

export type TListing = {
  imageUrls: string[];
  designer: string;
  size: string;
  title: string;
  price: number;
  status: "AVAILABLE" | "SOLD";
  id: string;
};

export interface RootLoaderData {
  ENV: Env;
  user: User | null;
}
