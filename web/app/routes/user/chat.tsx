import type { LoaderFunction } from "@remix-run/node";
import type { ChatContext, Chats } from "~/types/chat";
import { Avatar } from "@mui/material";
import { redirect } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useMemo } from "react";
import { getCookieValue } from "~/utils/cookie";
import { fetchInstance } from "~/utils/fetchInstance";
import ProfileImage from "../../assets/profile.jpeg";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = Number(getCookieValue("userId", request));
  if (params.chatId === "new") return redirect("/user/chat");

  const user = await fetchInstance({
    request,
    method: "POST",
    body: { userId },
    route: "/user/get",
  }).then((res) => res.json());

  return { chats: user.Chats, userId };
};

const IndexRoute = () => {
  const { chatId } = useParams();
  const { chats, userId } = useLoaderData<{ chats: Chats[]; userId: number }>();
  const { sendMessage, lastMessage, readyState } =
    useOutletContext<ChatContext>();

  const noChatsWithMessages = useMemo(
    () => chats.every((chat) => chat.Messages.length === 0),
    [chats]
  );

  if (chats?.length === 0) {
    return (
      <div className="mt-6 text-2xl flex items-center justify-center h-[calc(100vh-74px)]">
        You don`t have any chats yet, message someone! &#128522;
      </div>
    );
  }

  return (
    <div className="flex w-full mt-1 mx-auto h-[calc(100vh-78px)] 2xl:w-3/4 justify-center border rounded-2xl">
      <div className="w-[30%] border-r-2 overflow-y-scroll scrollbar-visible">
        {!noChatsWithMessages &&
          chats.map((chat) => (
            <div key={chat.id}>
              {chat.Messages.length !== 0 && (
                <Link
                  to={`/user/chat/${chat.id}`}
                  className={`${
                    Number(chatId) === chat.id
                      ? "bg-main text-white"
                      : "hover:bg-[#f4f4f5]"
                  } flex px-2 py-3 rounded-2xl gap-2 max-w-full overflow-hidden mr-1`}
                >
                  <Avatar
                    src={chat.Users[0].avatarUrl || ProfileImage}
                    sx={{ width: 52, height: 52 }}
                  />
                  <div className="max-w-full overflow-hidden">
                    <div className="font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                      {chat.Users[0].nickname}
                    </div>
                    <div className="mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
                      {chat.Messages[0].text}
                    </div>
                  </div>
                  {chat.notification &&
                    chat.Messages[0].senderId !== userId && (
                      <div className="ml-auto min-w-[12px] w-3 h-3 mt-1.5 bg-main rounded-full" />
                    )}
                </Link>
              )}
            </div>
          ))}
      </div>
      {chatId ? (
        <Outlet context={{ sendMessage, lastMessage, readyState }} />
      ) : (
        <div className="w-[70%] flex items-center justify-center">
          <div className="text-lg font-medium bg-[#f4f4f5] px-3 py-1 rounded-3xl">
            Select a chat to start messaging
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexRoute;
