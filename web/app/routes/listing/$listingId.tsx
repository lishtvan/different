import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { fetchInstance } from "~/utils/fetchInstance";
import ImageGallery from "react-image-gallery";
import { useMemo } from "react";
import { Avatar, Button } from "@mui/material";
import ProfileImage from "./../../assets/profile.jpeg";

export const loader: LoaderFunction = async ({ request, params }) => {
  const listingId = Number(params.listingId);

  const listingData = await fetchInstance({
    request,
    route: "/listing/get",
    method: "POST",
    body: { listingId },
  });
  return listingData;
};

const ListingRoute = () => {
  const { listing, seller } = useLoaderData();
  const { tags, images } = useMemo(() => {
    const formattedImages = listing.imageUrls.map((imageUrl: string) => ({
      original: imageUrl,
      thumbnail: imageUrl,
    }));
    const formattedTags = listing.tags.split(",");
    return { images: formattedImages, tags: formattedTags };
  }, [listing]);

  return (
    <div className="w-full my-3 flex flex-col gap-6 lg:gap-14 mx-auto justify-center md:flex-row">
      <div className="w-full md:w-[55%] lg:w-[40%] lg:min-w-[40%]">
        <ImageGallery infinite showPlayButton={false} items={images} />
      </div>
      <div className="gap-y-3 flex flex-col w-full md:max-w-[380px]">
        <div className="text-2xl font-bold mb-3">{listing.title}</div>
        <div className="text-xl">Designer: {listing.designer}</div>
        <div className="text-xl">Size: {listing.size}</div>
        <div className="text-xl">Category: {listing.category}</div>
        <div className="text-xl">Condition: {listing.condition}</div>
        <div className="text-2xl my-4 font-bold">{listing.price}₴</div>
        <div className="flex w-fit md:w-full items-start gap-5 flex-col">
          <Button variant="contained" className="w-full min-w-fit">
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
              <div className="text-xl">{seller?.nickname || seller?.name}</div>
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
  );
};

export default ListingRoute;
