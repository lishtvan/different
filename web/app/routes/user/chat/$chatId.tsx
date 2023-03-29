import type { ChatContext, Message, Participants } from "~/types/chat";
import { Send } from "@mui/icons-material";
import { Avatar, IconButton, TextField } from "@mui/material";
import {
  Link,
  useFetcher,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import type { KeyboardEvent } from "react";
import { useEffect, useState } from "react";
import ProfileImage from "../../../assets/profile.jpeg";
import { ReadyState } from "react-use-websocket";

export const action = () => {
  return null;
};

const IndexRoute = () => {
  const { chatId } = useParams();
  const fetcher = useFetcher();
  const { sendMessage, lastMessage, readyState } =
    useOutletContext<ChatContext>();

  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participants>();

  const sendTextMessage = () => {
    if (inputValue.trim().length === 0) {
      setInputValue("");
      return;
    }
    sendMessage(JSON.stringify({ text: inputValue, chatId }));
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "Enter") sendTextMessage();
  };

  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return;
    sendMessage(JSON.stringify({ chatId, isConnect: true }));
  }, [chatId, readyState]);

  useEffect(() => {
    if (!lastMessage) return;
    const msg = JSON.parse(lastMessage.data);
    if (msg.chat) {
      setMessages(msg.chat.Messages);
      setParticipants(msg.chat.Users);
      fetcher.submit(
        { route: location.pathname },
        { method: "post", action: "/" }
      );
    }
    if (msg.text && msg.chatId === chatId) {
      setMessages([msg, ...messages]);
      if (
        msg.senderId !== participants?.sender.id &&
        location.pathname === `/user/chat/${chatId}`
      ) {
        sendMessage(JSON.stringify({ messageSeen: true, chatId }));
      }
    }
  }, [lastMessage]);

  return (
    <div className="flex w-[70%] flex-col justify-end">
      <Link
        to={`/${participants?.recipient.nickname}`}
        className="mb-auto border-b-2 py-2 pl-2 text-xl font-semibold hover:text-main"
      >
        {participants?.recipient.nickname}
      </Link>
      <div className="scrollbar-visible ml-4 flex flex-col-reverse gap-2 overflow-y-scroll py-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-center gap-2">
            <Avatar
              alt="avatar"
              src={
                (participants?.recipient.id === msg.senderId
                  ? participants.recipient.avatarUrl
                  : participants?.sender.avatarUrl) || ProfileImage
              }
            />
            <div
              className={`${
                msg.senderId === participants?.sender.id
                  ? "bg-main text-white"
                  : "bg-[#efefef]"
              }  w-fit max-w-[80%] select-text break-words rounded-xl px-3 py-1.5 text-lg lg:max-w-[50%]`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-1 mb-1 flex w-full">
        <TextField
          placeholder="Write a message..."
          className="w-full"
          autoComplete="off"
          autoFocus={true}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IconButton
          size="large"
          onClick={sendTextMessage}
          className="p-2 hover:bg-transparent hover:text-main"
        >
          <Send className="hover:bg-none" sx={{ height: 34, width: 34 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default IndexRoute;
