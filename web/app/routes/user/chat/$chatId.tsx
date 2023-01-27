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
    if (msg.text && msg.chatId === Number(chatId)) {
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
    <div className="w-[70%] flex flex-col justify-end">
      <Link
        to={`/user/${participants?.recipient.id}`}
        className="mb-auto font-semibold text-xl pl-2 py-2 border-b-2 hover:text-main"
      >
        {participants?.recipient.nickname}
      </Link>
      <div className="ml-4 py-3 flex flex-col-reverse gap-2 overflow-y-scroll scrollbar-visible">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2 items-center">
            <Avatar
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
              }  break-words select-text px-3 py-1.5 rounded-xl w-fit text-lg max-w-[80%] lg:max-w-[50%]`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full mb-1 mx-1">
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
          className="hover:bg-transparent hover:text-main p-2"
        >
          <Send className="hover:bg-none" sx={{ height: 34, width: 34 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default IndexRoute;
