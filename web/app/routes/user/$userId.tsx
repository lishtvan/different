import { Avatar, Button } from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchInstance } from "~/utils/fetchInstance";
import ProfileImage from "./../../assets/profile.jpeg";

export const loader: LoaderFunction = async ({ request, params }) => {
  const response = await fetchInstance({
    request,
    method: "POST",
    body: {
      userId: params.userId,
    },
    route: "/user/get",
  });
  return response;
};

const UserRoute = () => {
  const { name, nickname, avatar } = useLoaderData();
  return (
    <div className="mt-4">
      <div className="flex justify-center items-center">
        <Avatar
          src={avatar || ProfileImage}
          sx={{ height: "160px", width: "160px" }}
        />
        <div className="ml-14">
          <div className="mt-2 flex justify-between">
            <div className="text-3xl font-normal">{nickname || name}</div>
            <div className="mt-1 ml-10">
              <Button variant="contained" sx={{ marginRight: "10px" }}>
                Follow
              </Button>
              <Button variant="contained" sx={{ marginRight: "10px" }}>
                Message
              </Button>
              <Button variant="contained">Edit</Button>
            </div>
          </div>
          <div className="my-5 flex">
            <div className="text-lg">578 listings</div>
            <div className="text-lg ml-7">468 followers</div>
            <div className="text-lg ml-7">221 sold</div>
          </div>
          <div className="max-w-lg">
            Новые шмотки носят только телки
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoute;
