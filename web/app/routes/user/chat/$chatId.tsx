import { Send } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { useParams } from "@remix-run/react";
import { useMemo, useState } from "react";

const IndexRoute = () => {
  const { chatId } = useParams();
  const ws = useMemo(() => {
    return new WebSocket("ws://localhost:8000/message");
  }, []);

  ws.onopen = () => {
    ws.send(JSON.stringify({ room: chatId }));
  };

  const [value, setValue] = useState("");

  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    console.log(msg);
    // if (msg.text) setMessage(msg.text);
  };

  return (
    <div className="w-[70%] flex items-end pl-2">
      <div className="flex w-full">
        <TextField
          placeholder="Write a message..."
          onChange={(e) => setValue(e.target.value)}
          className="w-full mr-2"
          value={value}
          autoComplete="off"
          autoFocus={true}
          focused={true}
          onBlur={(e) => e.target.focus()}
          onKeyDown={(e) => {
            if (e.key === "Enter") console.log("press");
          }}
        />
        <IconButton
          size="large"
          className="hover:bg-transparent hover:text-main p-2"
          onClick={() => ws.send(JSON.stringify({ text: value, room: chatId }))}
        >
          <Send className="hover:bg-none" sx={{ height: 34, width: 34 }} />
        </IconButton>
      </div>

      {/* <div>{message}</div> */}
    </div>
  );
};

export default IndexRoute;
