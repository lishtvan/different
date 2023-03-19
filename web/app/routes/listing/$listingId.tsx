import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { fetcher } from "~/utils/fetcher";
import ImageGallery from "react-image-gallery";
import { useCallback, useMemo, useState } from "react";
import { Avatar, Button, IconButton, Tooltip } from "@mui/material";
import ProfileImage from "./../../assets/profile.jpeg";
import { Delete, Edit } from "@mui/icons-material";
import Typesense from "typesense";
import {
  getTypesenseConfig,
  LISTINGS_COLLECTION_NAME,
} from "~/constants/typesense";
import PurchaseModal from "~/components/listing/PurchaseModal";

export const loader: LoaderFunction = async ({ request, params }) => {
  const listingId = Number(params.listingId);

  const response = await fetcher({
    request,
    route: "/listing/get",
    method: "POST",
    body: { listingId },
  }).then((res) => res.json());

  return response;
};

export const action: ActionFunction = async ({ request, params }) => {
  const listingId = Number(params.listingId);
  const response = await fetcher({
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

  return redirect("/");
};

const ListingRoute = () => {
  const { listing, isOwnListing } = useLoaderData();
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const { listingId } = useParams();

  const { images } = useMemo(() => {
    const imageGalleryImages = listing?.imageUrls.map((imageUrl: string) => ({
      original: imageUrl,
      thumbnail: imageUrl,
    }));
    return { images: imageGalleryImages };
  }, [listing]);

  const togglePurchaseModal = useCallback(() => {
    setIsPurchaseOpen(!isPurchaseOpen);
  }, [isPurchaseOpen]);

  return (
    <Form method="post">
      <div className="my-3 mx-auto flex w-full flex-col justify-center gap-6 md:flex-row lg:gap-14">
        <PurchaseModal toggle={togglePurchaseModal} isOpen={isPurchaseOpen} />
        <div className="w-full md:w-[55%] lg:w-[40%] lg:min-w-[40%]">
          <ImageGallery
            slideDuration={200}
            infinite
            showPlayButton={false}
            showThumbnails={images.length > 1}
            items={images}
          />
        </div>
        <div className="mb-10 flex w-full flex-col gap-y-3 md:max-w-[380px]">
          <div className="mb-2 flex items-start justify-between">
            <div className="pt-[0.55rem] text-2xl font-bold">
              {listing?.title}
            </div>
            {isOwnListing && (
              <div className="ml-4 flex">
                <Tooltip title="Edit listing">
                  <Link to={`/listing/${listingId}/edit`}>
                    <IconButton size="large" color="inherit">
                      <Edit />
                    </IconButton>
                  </Link>
                </Tooltip>
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
              </div>
            )}
          </div>
          <div className="text-xl">Designer: {listing?.designer}</div>
          <div className="text-xl">Size: {listing?.size}</div>
          <div className="text-xl">Category: {listing?.category}</div>
          <div className="text-xl">Condition: {listing?.condition}</div>
          <div className="my-4 text-2xl font-bold">{listing?.price}₴</div>
          <div className="flex w-fit flex-col items-start gap-3 md:w-full">
            {!isOwnListing && (
              <div className="flex w-full gap-2">
                <Button
                  variant="contained"
                  className="w-full min-w-fit"
                  onClick={togglePurchaseModal}
                >
                  Purchase
                </Button>

                <Link
                  className="w-full min-w-fit"
                  to={`/user/chat/new/${listing?.User.id}`}
                >
                  <Button variant="outlined" className="w-full min-w-fit">
                    Message
                  </Button>
                </Link>
              </div>
            )}

            <Link
              className="mb-5 flex w-full items-center gap-4 rounded-lg border border-main py-1 px-2"
              to={`/${listing?.User.nickname}`}
            >
              <Avatar
                sx={{ width: 50, height: 50 }}
                src={listing?.User.avatarUrl || ProfileImage}
              />
              <div>
                <div className="text-xl">{listing?.User.nickname}</div>
                <div className="flex gap-2 text-sm text-[#737373]">
                  <div>10 listings</div>
                  <div>6 sold</div>
                </div>
              </div>
            </Link>
          </div>
          {listing?.tags.length > 0 && (
            <div className="mr-2 mb-2 flex flex-wrap gap-2">
              {listing.tags.map((tag: string) => (
                <div
                  key={tag}
                  className="w-fit rounded-lg border border-main py-1 px-2 text-xl text-main"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
          {listing?.description && (
            <div className="whitespace-pre-wrap">
              <div className="text-xl font-semibold">Description</div>
              <div className="mt-2 text-lg">{listing.description}</div>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};

export default ListingRoute;
