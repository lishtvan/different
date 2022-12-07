import { Avatar } from "@mui/material";
import { Link, Outlet, useParams } from "@remix-run/react";

const IndexRoute = () => {
  const { chatId } = useParams();

  return (
    <div className="flex w-full mt-1 mx-auto h-[calc(100vh-74px)]">
      <div className="w-[30%] border-r-2 overflow-y-scroll">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <Link
            to={`/user/chat/${item}`}
            key={item}
            className={`${
              Number(chatId) === item
                ? "bg-main text-white"
                : "hover:bg-[#f4f4f5]"
            } flex px-2 py-3 rounded-2xl gap-2 max-w-full overflow-hidden mr-1`}
          >
            <Avatar sx={{ width: 54, height: 54 }} />
            <div className="max-w-full overflow-hidden">
              <div className="font-semibold">Юрий Яблоновский</div>
              <div className="mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
                Как думаешь на сколько процентов запуск зимой обречён на провал
                ?
              </div>
            </div>
          </Link>
        ))}
      </div>
      {chatId ? (
        <Outlet />
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
