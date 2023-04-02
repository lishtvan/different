import type { ReadyState, SendMessage } from "react-use-websocket";
import type { User } from "./user";

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
