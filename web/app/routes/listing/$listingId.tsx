import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { fetchInstance } from "~/utils/fetchInstance";
import ImageGallery from "react-image-gallery";
import { useMemo } from "react";
import ukrPoshtaIcon from "./../../assets/ukr-poshta.png";
import novaposhtaIcon from "./../../assets/nova-poshta.png";
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
    <div className="w-full my-3 flex flex-col gap-14 mx-auto justify-center md:flex-row">
      <div className="w-full  md:w-2/5 md:min-w-2/5">
        <ImageGallery infinite showPlayButton={false} items={images} />
      </div>
      <div className="gap-y-3 flex flex-col w-full md:max-w-[30%] md:w-fit">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold">{listing.title}</div>
          </div>
          <Link
            className="flex items-center gap-4 ml-3 border-main rounded-md border py-1 px-2"
            to={`/user/${seller.id}`}
          >
            <Avatar
              sx={{ width: 50, height: 50 }}
              src={seller?.avatarUrl || ProfileImage}
            />
            <div className="text-xl">{seller?.nickname || seller?.name}</div>
          </Link>
        </div>
        <div className="text-xl">Designer: {listing.designer}</div>
        <div className="text-xl">Size: {listing.size}</div>
        <div className="text-xl">Category: {listing.category}</div>
        <div className="text-xl">Condition: {listing.condition}</div>
        {listing?.tags && (
          <div className="flex gap-2 flex-wrap mr-2">
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
        <div className="my-2 flex gap-6">
          {listing?.shipping.includes("novaPoshta") && (
            <img src={novaposhtaIcon} className="w-24" alt="Nova Poshta" />
          )}
          {listing?.shipping.includes("ukrPoshta") && (
            <img src={ukrPoshtaIcon} className="w-36" alt="UkrPoshta" />
          )}
        </div>
        <div className="text-2xl my-4 font-bold">{listing.price}₴</div>
        <Button variant="contained">Purchase</Button>
        {listing.description && (
          <div className="my-6">
            <div className="text-xl font-semibold">Description</div>
            <div className="text-lg mt-2">{listing.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingRoute;
