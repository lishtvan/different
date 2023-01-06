import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { Message, Participants } from "~/types/chat";
import { Send } from "@mui/icons-material";
import { Avatar, IconButton, TextField } from "@mui/material";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import { useEffect, useMemo, useRef, useState } from "react";
import ProfileImage from "../../../assets/profile.jpeg";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const message = formData.get("message")?.toString().trim();

  if (message?.length === 0) return null;
  return message;
};

export const loader: LoaderFunction = async ({ request }) => {
  const wsConnection = process.env.ENVIRONMENT === "local" ? "ws" : "wss";
  return wsConnection;
};

const IndexRoute = () => {
  const wsConnection = useLoaderData();
  const { chatId } = useParams();
  console.log(wsConnection);
  const message = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  const transition = useTransition();

  const ws = useMemo(
    () => new WebSocket(`${wsConnection}://localhost:8000/chat/message`),
    [chatId, wsConnection]
  );

  ws.onopen = () => {
    ws.send(JSON.stringify({ chatId, isConnect: true }));
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participants>();

  useEffect(() => {
    if (transition.state !== "submitting") formRef?.current?.reset();
  }, [transition]);

  useEffect(() => {
    if (!message) return;
    ws.send(JSON.stringify({ text: message, chatId }));
  }, [message]);

  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.chat) {
      setMessages(msg.chat.Messages);
      setParticipants(msg.chat.Users);
    }
    if (msg.text && msg.chatId === Number(chatId)) {
      setMessages([msg, ...messages]);
    }
  };

  return (
    <div className="w-[70%] flex flex-col justify-end">
      <Link
        to={`/user/${participants?.recipient.id}`}
        className="mb-auto font-semibold text-xl pl-2 py-2 border-b-2 hover:text-main"
      >
        {participants?.recipient.nickname || participants?.recipient.name}
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
            <div className="bg-[#efefef] break-words select-text px-3 py-1.5 rounded-xl w-fit text-lg max-w-[80%] lg:max-w-[50%]">
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <Form replace method="post" ref={formRef} className="flex w-full ml-2">
        <TextField
          placeholder="Write a message..."
          name="message"
          className="w-full mr-2"
          autoComplete="off"
          autoFocus={true}
        />
        <IconButton
          size="large"
          className="hover:bg-transparent hover:text-main p-2"
          type="submit"
        >
          <Send className="hover:bg-none" sx={{ height: 34, width: 34 }} />
        </IconButton>
      </Form>
    </div>
  );
};

export default IndexRoute;
