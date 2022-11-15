import { Avatar, Button } from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { LocationOnOutlined, Settings } from "@mui/icons-material";
import { fetchInstance } from "~/utils/fetchInstance";
import ProfileImage from "./../../assets/profile.jpeg";

export const loader: LoaderFunction = async ({ request, params }) => {
  const response = await fetchInstance({
    request,
    method: "POST",
    body: { userId: Number(params.userId) },
    route: "/user/get",
  });

  return response;
};

const UserRoute = () => {
  const { name, nickname, avatarUrl, isOwnAccount, bio, location } =
    useLoaderData();

  return (
    <div className="mt-4">
      <div className="flex justify-center items-center">
        <Avatar
          src={avatarUrl || ProfileImage}
          sx={{ height: "160px", width: "160px" }}
        />
        <div className="ml-14">
          <div className="mt-2 flex justify-between">
            <div className="text-3xl font-normal">{nickname || name}</div>
            <div className="ml-10">
              {!isOwnAccount ? (
                <>
                  <Button variant="outlined" sx={{ marginRight: "10px" }}>
                    Leave review
                  </Button>
                  <Button variant="outlined" sx={{ marginRight: "10px" }}>
                    Message
                  </Button>
                </>
              ) : (
                <Link to="/user/edit">
                  <Button
                    variant="outlined"
                    className="rounded-md"
                    startIcon={<Settings className="text-main" />}
                  >
                    Settings
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="my-3 flex">
            <div className="text-lg">
              <b>5</b> listings
            </div>
            <div className="text-lg ml-7">
              <b>8</b> sold
            </div>
          </div>
          <div className=" max-w-md break-words">{bio}</div>
          {location && (
            <div className="mt-3 flex">
              <div>
                <LocationOnOutlined />
              </div>
              <div className="text-lg ml-2">{location}</div>
            </div>
          )}
        </div>
      </div>
      <div>profile listings</div>
    </div>
  );
};

export default UserRoute;
