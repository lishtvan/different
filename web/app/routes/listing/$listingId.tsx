import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { fetchInstance } from "~/utils/fetchInstance";
import ImageGallery from "react-image-gallery";
import { useCallback, useMemo, useState } from "react";
import { Avatar, Button, IconButton, Tooltip } from "@mui/material";
import ProfileImage from "./../../assets/profile.jpeg";
import { Delete } from "@mui/icons-material";
import Typesense from "typesense";
import {
  getTypesenseConfig,
  LISTINGS_COLLECTION_NAME,
} from "~/constants/typesense";
import PurchaseModal from "~/components/listing/PurchaseModal";

export const loader: LoaderFunction = async ({ request, params }) => {
  const listingId = Number(params.listingId);

  const response = await fetchInstance({
    request,
    route: "/listing/get",
    method: "POST",
    body: { listingId },
  }).then((res) => res.json());

  return response;
};

export const action: ActionFunction = async ({ request, params }) => {
  const listingId = Number(params.listingId);
  const response = await fetchInstance({
    request,
    route: "/listing/delete",
    method: "POST",
    body: { listingId },
  });
  if (response.headers.get("location")) return null;
  const writeConfig = getTypesenseConfig({ isWriteConfig: true });
  const typesenseClient = new Typesense.Client(writeConfig);
  await typesenseClient
    .collections(LISTINGS_COLLECTION_NAME)
    .documents(params.listingId!)
    .delete();

  return redirect("/user");
};

const ListingRoute = () => {
  const { listing, seller, isOwnListing } = useLoaderData();
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  const { tags, images } = useMemo(() => {
    const formattedImages = listing.imageUrls.map((imageUrl: string) => ({
      original: imageUrl,
      thumbnail: imageUrl,
    }));
    const formattedTags = listing.tags.split(",");
    return { images: formattedImages, tags: formattedTags };
  }, [listing]);

  const togglePurchaseModal = useCallback(() => {
    setIsPurchaseOpen(!isPurchaseOpen);
  }, [isPurchaseOpen]);

  return (
    <Form method="post">
      <div className="w-full my-3 flex flex-col gap-6 lg:gap-14 mx-auto justify-center md:flex-row">
        <PurchaseModal toggle={togglePurchaseModal} isOpen={isPurchaseOpen} />
        <div className="w-full md:w-[55%] lg:w-[40%] lg:min-w-[40%]">
          <ImageGallery infinite showPlayButton={false} items={images} />
        </div>
        <div className="gap-y-3 flex flex-col w-full md:max-w-[380px]">
          <div className="mb-2 flex justify-between items-center">
            <div className="text-2xl font-bold">{listing.title}</div>
            {isOwnListing && (
              <Tooltip title="Delete listing">
                <IconButton
                  type="submit"
                  name="delete"
                  value="delete"
                  size="large"
                  color="inherit"
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <div className="text-xl">Designer: {listing.designer}</div>
          <div className="text-xl">Size: {listing.size}</div>
          <div className="text-xl">Category: {listing.category}</div>
          <div className="text-xl">Condition: {listing.condition}</div>
          <div className="text-2xl my-4 font-bold">{listing.price}₴</div>
          <div className="flex w-fit md:w-full items-start gap-5 flex-col">
            <Button
              variant="contained"
              className="w-full min-w-fit"
              onClick={togglePurchaseModal}
            >
              Purchase
            </Button>
            <Link
              className="flex w-full items-center gap-4 border-main rounded-md border py-1 px-2"
              to={`/user/${seller.id}`}
            >
              <Avatar
                sx={{ width: 50, height: 50 }}
                src={seller?.avatarUrl || ProfileImage}
              />
              <div>
                <div className="text-xl">
                  {seller?.nickname || seller?.name}
                </div>
                <div className="flex gap-2 text-sm text-[#737373]">
                  <div>10 listings</div>
                  <div>6 sold</div>
                </div>
              </div>
            </Link>
          </div>
          {listing.description && (
            <div className="mt-6 whitespace-pre-wrap">
              <div className="text-xl font-semibold">Description</div>
              <div className="text-lg mt-2">{listing.description}</div>
            </div>
          )}
          {listing?.tags && (
            <div className="flex gap-2 flex-wrap mr-2 mb-6">
              {tags.map((tag: string) => (
                <div
                  key={tag}
                  className="text-xl w-fit border-main rounded-md text-main border py-1 px-2"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};

export default ListingRoute;
