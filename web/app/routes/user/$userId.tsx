import { Avatar, Button, IconButton } from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { LocationOnOutlined, Settings } from "@mui/icons-material";
import { activeNavLinkStyle, notActiveNavLinkStyle } from "~/constants/styles";
import { getCookieValue } from "~/utils/cookie";
import { fetchInstance } from "~/utils/fetchInstance";
import ProfileImage from "./../../assets/profile.jpeg";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = getCookieValue("userId", request);

  if (!params.userId || isNaN(Number(params.userId))) return redirect("/");
  const user = await fetchInstance({
    request,
    method: "POST",
    body: { userId: Number(params.userId) },
    route: "/user/get",
  }).then((res) => res.json());

  // TODO: fix not found
  if (user.statusCode === 404) return redirect("/");

  return {
    ...user,
    isOwnAccount: userId === params.userId,
  };
};

const UserRoute = () => {
  const { name, nickname, avatarUrl, isOwnAccount, bio, location } =
    useLoaderData();
  const { pathname } = useLocation();

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
                  <IconButton>
                    <Settings className="text-main" />
                  </IconButton>
                </Link>
              )}
            </div>
          </div>
          <div className="my-3 flex">
            <NavLink
              to={""}
              style={() =>
                !pathname.endsWith("reviews")
                  ? activeNavLinkStyle
                  : notActiveNavLinkStyle
              }
            >
              <div className="text-lg">
                <b>5</b> listings
              </div>
            </NavLink>
            <NavLink
              to={"reviews"}
              style={({ isActive }) =>
                isActive ? activeNavLinkStyle : notActiveNavLinkStyle
              }
            >
              <div className="text-lg ml-7">
                <b>8</b> reviews
              </div>
            </NavLink>

            <div className="text-lg ml-7">
              <b>1</b> sold
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
      <Outlet />
    </div>
  );
};

export default UserRoute;
