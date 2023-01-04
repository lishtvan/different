import { Avatar, Button, IconButton } from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { LocationOnOutlined, Send, Settings } from "@mui/icons-material";
import { fetchInstance } from "~/utils/fetchInstance";
import ProfileImage from "./../../assets/profile.jpeg";
import { InstantSearch } from "react-instantsearch-hooks-web";
import {
  getTypesenseConfig,
  LISTINGS_COLLECTION_NAME,
} from "~/constants/typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import UserListings from "~/components/index/listings/UserListings";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await fetchInstance({
    request,
    method: "POST",
    body: { userId: Number(params.userId) },
    route: "/user/get",
  }).then((res) => res.json());

  const typesenseConfig = getTypesenseConfig({ isWriteConfig: false });

  return { ...user, typesenseConfig };
};

const UserRoute = () => {
  const {
    name,
    nickname,
    avatarUrl,
    isOwnAccount,
    bio,
    location,
    typesenseConfig,
  } = useLoaderData();
  const { userId } = useParams();
  const { searchClient } = new TypesenseInstantsearchAdapter({
    server: typesenseConfig,
    additionalSearchParameters: {
      query_by: "title,designer",
    },
  });

  return (
    <InstantSearch
      indexName={LISTINGS_COLLECTION_NAME}
      searchClient={searchClient}
    >
      <div className="mt-4">
        <div className="flex justify-center items-center">
          <Avatar
            src={avatarUrl || ProfileImage}
            sx={{ height: "160px", width: "160px" }}
          />
          <div className="ml-14">
            <div className="mt-2 flex justify-between items-center">
              <div className="text-2xl font-normal">{nickname || name}</div>
              <div className="ml-10">
                {isOwnAccount ? (
                  <Link to="/user/edit">
                    <IconButton>
                      <Settings className="text-main" />
                    </IconButton>
                  </Link>
                ) : (
                  <Link to={`/user/chat/new/${userId}`}>
                    <Button
                      className="text-black text-sm"
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
              <div className="text-lg ml-7">
                <b>8</b> sold
              </div>
            </div>
            <div className="max-w-md break-words">{bio}</div>
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
        <UserListings />
      </div>
    </InstantSearch>
  );
};

export default UserRoute;
