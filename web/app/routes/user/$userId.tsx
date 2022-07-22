import { Avatar, Button } from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { S3_URL } from "~/constants/s3";
import { activeNavLinkStyle, notActiveNavLinkStyle } from "~/constants/styles";
import { getCookieValue } from "~/utils/cookie";
import { fetchInstance } from "~/utils/fetchInstance";
import ProfileImage from "./../../assets/profile.jpeg";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = getCookieValue("userId", request);

  const response = await fetchInstance({
    request,
    method: "POST",
    body: {
      userId: params.userId,
    },
    route: "/user/get",
  });

  const res = await response.json();

  return {
    ...res,
    isOwnAccount: userId === params.userId,
  };
};

const UserRoute = () => {
  const { name, nickname, avatarKey, isOwnAccount, bio } = useLoaderData();
  const location = useLocation();

  return (
    <div className="mt-4">
      <div className="flex justify-center items-center">
        <Avatar
          src={(avatarKey && `${S3_URL}/${avatarKey}`) || ProfileImage}
          sx={{ height: "160px", width: "160px" }}
        />
        <div className="ml-14">
          <div className="mt-2 flex justify-between">
            <div className="text-3xl font-normal">{nickname || name}</div>
            <div className="ml-10">
              {!isOwnAccount ? (
                <>
                  <Button variant="contained" sx={{ marginRight: "10px" }}>
                    Leave review
                  </Button>
                  <Button variant="contained" sx={{ marginRight: "10px" }}>
                    Message
                  </Button>
                </>
              ) : (
                <Link to="/user/edit">
                  <Button variant="outlined" sx={{ color: "black" }}>
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="my-5 flex">
            <NavLink
              to={""}
              style={() =>
                !location.pathname.endsWith("reviews")
                  ? activeNavLinkStyle
                  : notActiveNavLinkStyle
              }
            >
              <div className="text-lg">
                <b>578</b> listings
              </div>
            </NavLink>
            <NavLink
              to={"reviews"}
              style={({ isActive }) =>
                isActive ? activeNavLinkStyle : notActiveNavLinkStyle
              }
            >
              <div className="text-lg ml-7">
                <b>468</b> reviews
              </div>
            </NavLink>

            <div className="text-lg ml-7">
              <b>221</b> sold
            </div>
          </div>
          <div className="max-w-lg">{bio}</div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default UserRoute;
