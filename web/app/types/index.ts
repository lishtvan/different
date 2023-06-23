import type { ReadyState, SendMessage } from "react-use-websocket";
import type { SHORT_SIZES } from "~/constants/listing";

export type Env = "local" | "development" | "production";

export interface User {
  id: number;
  nickname: string;
  avatarUrl?: string;
  bio: string;
  location: string;
}

export interface Message {
  text: string;
  id: number;
  senderId: number;
}

export interface Chats {
  id: string;
  notification: boolean;
  Users: User[];
  Messages: Message[];
}

export interface Participants {
  recipient: User;
  sender: User;
}

export interface ChatContext {
  sendMessage: SendMessage;
  readyState: ReadyState;
  lastMessage: MessageEvent<any> | null;
}

export type TListing = {
  imageUrls: string[];
  designer: string;
  size: keyof typeof SHORT_SIZES;
  title: string;
  price: number;
  status: "AVAILABLE" | "SOLD";
  id: string;
};

export interface RootLoaderData {
  ENV: Env;
  locale: string;
  user: User | null;
}
