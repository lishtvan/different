interface User {
  id: number;
  nickname?: string;
  avatarUrl?: string;
  name: string;
}

export interface Message {
  text: string;
  id: number;
  senderId: number;
}

export interface Chats {
  id: number;
  notification: boolean;
  Users: User[];
  Messages: Message[];
}

export interface Participants {
  recipient: User;
  sender: User;
}

export interface ChatContext {
  ws: WebSocket;
  isWsReady: boolean;
}
