import { Avatar, Button, IconButton } from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { LocationOnOutlined, Send, Settings } from "@mui/icons-material";
import { fetcher } from "~/utils/fetcher";
import ProfileImage from "./../assets/profile.jpeg";
import { InstantSearch } from "react-instantsearch-hooks-web";
import { LISTINGS_COLLECTION_NAME } from "~/constants/typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import UserListings from "~/components/index/listings/UserListings";
import { useMemo } from "react";
import { config } from "~/constants/envConfig";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await fetcher({
    request,
    method: "POST",
    body: { nickname: params.user },
    route: "/user/get",
  });

  return user;
};

const UserRoute = () => {
  const { nickname, avatarUrl, isOwnAccount, bio, id, location } =
    useLoaderData();
  const { ENV } = useRouteLoaderData("root") as {
    ENV: "local" | "development" | "production";
  };

  const { searchClient } = useMemo(() => {
    return new TypesenseInstantsearchAdapter({
      server: config[ENV].typesense,
      additionalSearchParameters: { query_by: "title,designer" },
    });
  }, []);

  return (
    <InstantSearch
      indexName={LISTINGS_COLLECTION_NAME}
      searchClient={searchClient}
    >
      <div className="mt-4">
        <div className="flex items-center justify-center">
          <Avatar
            src={avatarUrl || ProfileImage}
            alt="avatar"
            sx={{ height: "160px", width: "160px" }}
          />
          <div className="ml-14">
            <div className="mt-2 flex items-center justify-between">
              <div className="text-2xl font-normal">{nickname}</div>
              <div className="ml-10">
                {isOwnAccount ? (
                  <Link to="/user/edit">
                    <IconButton>
                      <Settings className="text-main" />
                    </IconButton>
                  </Link>
                ) : (
                  <Link to={`/user/chat/new/${id}`}>
                    <Button
                      className="text-sm text-black"
                      variant="outlined"
                      endIcon={<Send />}
                    >
                      Message
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="my-3 flex">
              <div className="text-lg">
                <b>5</b> listings
              </div>
              <div className="ml-7 text-lg">
                <b>8</b> sold
              </div>
            </div>
            <div className="max-w-md break-words">{bio}</div>
            {location && (
              <div className="mt-3 flex">
                <div>
                  <LocationOnOutlined />
                </div>
                <div className="ml-2 text-lg">{location}</div>
              </div>
            )}
          </div>
        </div>
        <UserListings userId={id} />
      </div>
    </InstantSearch>
  );
};

export default UserRoute;
