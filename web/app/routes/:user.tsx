import { Avatar, Button, IconButton } from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import {
  Link,
  NavLink,
  useLoaderData,
  useRouteLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { LocationOnOutlined, Send, Settings } from "@mui/icons-material";
import { fetcher } from "~/fetcher.server";
import ProfileImage from "./../assets/profile.jpeg";
import { InstantSearch } from "react-instantsearch-hooks-web";
import { LISTINGS_COLLECTION_NAME } from "~/constants/typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import UserListings from "~/components/index/UserListings";
import { useMemo } from "react";
import { config } from "~/constants/config";
import type { Env } from "~/types";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";

export const loader: LoaderFunction = async ({ request, params }) => {
  const response = await fetcher({
    request,
    method: "POST",
    body: { nickname: params.user },
    route: "/user/get",
  });

  return response;
};

const UserRoute = () => {
  const {
    nickname,
    avatarUrl,
    isOwnAccount,
    bio,
    id,
    location,
    availableListingsCount,
    soldListingsCount,
  } = useLoaderData();
  const { ENV } = useRouteLoaderData("root") as { ENV: Env };
  const [searchParams] = useSearchParams();

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
              <div className="text-2xl font-semibold">{nickname}</div>
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
                      Повідомлення
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="my-3 flex">
              <NavLink
                to={""}
                className={`text-lg ${
                  searchParams.get("q")
                    ? " decoration-main decoration-2 underline-offset-[5px] hover:underline"
                    : "underline decoration-main decoration-2 underline-offset-[5px]"
                }`}
              >
                <b>{availableListingsCount}</b> оголошень
              </NavLink>
              <NavLink
                to={"?q=sold"}
                className={`ml-7 text-lg ${
                  searchParams.get("q") === "sold"
                    ? "underline decoration-main decoration-2 underline-offset-[5px]"
                    : "decoration-main decoration-2 underline-offset-[5px] hover:underline"
                }`}
              >
                <b>{soldListingsCount}</b> проданих
              </NavLink>
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
        <UserListings userId={id} showSold={searchParams.get("q") === "sold"} />
      </div>
    </InstantSearch>
  );
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
export default UserRoute;
