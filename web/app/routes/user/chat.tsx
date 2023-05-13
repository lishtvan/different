import type { LoaderFunction } from "@remix-run/node";
import type { ChatContext, Chats } from "~/types";
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
import { fetcher } from "~/fetcher.server";
import ProfileImage from "../../assets/profile.jpeg";
import { useTranslation } from "react-i18next";

export const loader: LoaderFunction = async ({ request, params }) => {
  if (params.chatId === "new") return redirect("/user/chat");
  const response = await fetcher({
    request,
    method: "POST",
    route: "/chat/getMany",
  });
  return response;
};

const IndexRoute = () => {
  const { chatId } = useParams();
  const { chats, userId } = useLoaderData<{ chats: Chats[]; userId: number }>();
  const { sendMessage, lastMessage, readyState } =
    useOutletContext<ChatContext>();
  const { t } = useTranslation();

  const noChatsWithMessages = useMemo(
    () => chats.every((chat) => chat.Messages.length === 0),
    [chats]
  );

  if (chats?.length === 0) {
    return (
      <div className="mt-6 flex h-[calc(100vh-74px)] items-center justify-center text-2xl">
        You don`t have any chats yet, message someone! &#128522;
      </div>
    );
  }

  return (
    <div className="mx-auto mt-1 flex h-[calc(100vh-78px)] w-full justify-center rounded-2xl border 2xl:w-3/4">
      <div className="scrollbar-visible w-[30%] overflow-y-scroll border-r-2">
        {!noChatsWithMessages &&
          chats.map((chat) => (
            <div key={chat.id}>
              {chat.Messages.length !== 0 && (
                <Link
                  to={`/user/chat/${chat.id}`}
                  className={`${
                    chatId === chat.id
                      ? "bg-main text-white"
                      : "hover:bg-[#f4f4f5]"
                  } mr-1 flex max-w-full gap-2 overflow-hidden rounded-2xl px-2 py-3`}
                >
                  <Avatar
                    src={chat.Users[0].avatarUrl || ProfileImage}
                    sx={{ width: 52, height: 52 }}
                    alt="avatar"
                  />
                  <div className="max-w-full overflow-hidden">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                      {chat.Users[0].nickname}
                    </div>
                    <div className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {chat.Messages[0].text}
                    </div>
                  </div>
                  {chat.notification &&
                    chat.Messages[0].senderId !== userId && (
                      <div className="ml-auto mt-1.5 h-3 w-3 min-w-[12px] rounded-full bg-main" />
                    )}
                </Link>
              )}
            </div>
          ))}
      </div>
      {chatId ? (
        <Outlet context={{ sendMessage, lastMessage, readyState }} />
      ) : (
        <div className="flex w-[70%] items-center justify-center">
          <div className="rounded-3xl bg-[#f4f4f5] px-3 py-1 text-lg font-medium">
            {t("Select a chat to start messaging")}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexRoute;
