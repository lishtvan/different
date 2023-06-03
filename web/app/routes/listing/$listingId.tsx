import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { fetcher } from "~/fetcher.server";
import ImageGallery from "react-image-gallery";
import { useCallback, useMemo, useState } from "react";
import { Avatar, Button, IconButton, Tooltip } from "@mui/material";
import ProfileImage from "./../../assets/profile.jpeg";
import { Delete, Edit } from "@mui/icons-material";
import PurchaseModal from "~/components/listing/PurchaseModal";
import { useTranslation } from "react-i18next";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";

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

  await fetcher({
    request,
    route: "/listing/delete",
    method: "POST",
    body: { listingId },
  });

  return redirect("/");
};

const ListingRoute = () => {
  const {
    listing,
    isOwnListing,
    sellerSoldListingsCount,
    sellerAvailableListingsCount,
  } = useLoaderData();
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const { listingId } = useParams();
  const { t } = useTranslation();

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
      <div className="mx-auto my-3 flex w-full flex-col justify-center gap-6 md:flex-row lg:gap-14">
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
                <Tooltip title={t("Edit listing")}>
                  <Link to={`/listing/${listingId}/edit`}>
                    <IconButton size="large" color="inherit">
                      <Edit />
                    </IconButton>
                  </Link>
                </Tooltip>
                <Tooltip title={t("Delete listing")}>
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
          <div className="text-xl">
            {t("Designer")}: {listing?.designer}
          </div>
          <div className="text-xl">
            {t("Size")}: {listing?.size}
          </div>
          <div className="text-xl">
            {t("Category")}: {listing?.category}
          </div>
          <div className="text-xl">
            {t("Condition")}: {listing?.condition}
          </div>
          <div
            className={`my-4 text-2xl font-bold ${
              listing.status === "SOLD" && "text-main"
            }`}
          >
            {listing?.price}₴ {listing.status === "SOLD" && "(Sold price)"}
          </div>
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
              className="mb-5 flex w-full items-center gap-4 rounded-lg border border-main px-2 py-1"
              to={`/${listing?.User.nickname}`}
            >
              <Avatar
                sx={{ width: 50, height: 50 }}
                src={listing?.User.avatarUrl || ProfileImage}
                alt="avatar"
              />
              <div>
                <div className="text-xl">{listing?.User.nickname}</div>
                <div className="flex gap-2 text-sm text-[#737373]">
                  <div>{sellerAvailableListingsCount} listings</div>
                  <div>{sellerSoldListingsCount} sold</div>
                </div>
              </div>
            </Link>
          </div>
          {listing?.tags.length > 0 && (
            <div className="mb-2 mr-2 flex flex-wrap gap-2">
              {listing.tags.map((tag: string) => (
                <div
                  key={tag}
                  className="w-fit rounded-lg border border-main px-2 py-1 text-xl text-main"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
          {listing?.description && (
            <div className="whitespace-pre-wrap">
              <div className="text-xl font-semibold">{t("Description")}</div>
              <div className="mt-2 text-lg">{listing.description}</div>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
export default ListingRoute;
