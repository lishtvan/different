import { Send } from "@mui/icons-material";
import { Avatar, IconButton, TextField } from "@mui/material";
import type { ActionFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useParams,
  useTransition,
} from "@remix-run/react";
import { useEffect, useMemo, useRef, useState } from "react";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return formData.get("message");
};

const IndexRoute = () => {
  const { chatId } = useParams();
  const message = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  const transition = useTransition();

  const ws = useMemo(
    () => new WebSocket("ws://localhost:8000/chat/message"),
    [chatId]
  );

  ws.onopen = () => {
    ws.send(JSON.stringify({ chatId }));
  };

  const [messages, setMessages] = useState<string[]>(['hello', 'hi', 'yo']);

  useEffect(() => {
    if (transition.state !== "submitting") formRef?.current?.reset();
  }, [transition]);

  useEffect(() => {
    if (!message) return;
    ws.send(JSON.stringify({ text: message, chatId }));
  }, [message]);

  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.text && msg.chatId === chatId) {
      setMessages([msg.text, ...messages]);
    }
  };

  return (
    <div className="w-[70%] flex flex-col justify-end">
      <div className="mb-auto font-semibold text-xl pl-2 py-2 border-b-2">Юрий Яблоновский</div>
      <div className="ml-4 py-3 flex flex-col-reverse gap-2 overflow-y-scroll">
        {messages.map((item) => (
          <div key={item} className="flex gap-2 items-center">
            <Avatar />
            <div className="bg-[#efefef] select-text px-4 py-2 rounded-xl w-fit text-lg max-w-[90%] lg:max-w-[50%]">
              {item}
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
          onClick={() => ws.send(JSON.stringify({ text: "eqw", chatId }))}
        >
          <Send className="hover:bg-none" sx={{ height: 34, width: 34 }} />
        </IconButton>
      </Form>
    </div>
  );
};

export default IndexRoute;
