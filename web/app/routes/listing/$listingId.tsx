import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchInstance } from "~/utils/fetchInstance";
import ImageGallery from "react-image-gallery";
import { useMemo } from "react";
import ukrPoshtaIcon from "./../../assets/ukr-poshta.png";
import novaposhtaIcon from "./../../assets/nova-poshta.png";
import { Button } from "@mui/material";

export const loader: LoaderFunction = async ({ request, params }) => {
  const listingId = Number(params.listingId);

  const listing = await fetchInstance({
    request,
    route: "/listing/get",
    method: "POST",
    body: { listingId },
  });

  return listing;
};

const ListingRoute = () => {
  const listing = useLoaderData();

  const { tags, images } = useMemo(() => {
    const formattedImages = listing.imageUrls.map((imageUrl: string) => ({
      original: imageUrl,
      thumbnail: imageUrl,
    }));
    const formattedTags = listing.tags.split(",");
    return { images: formattedImages, tags: formattedTags };
  }, [listing]);

  return (
    <div className="w-full my-3 flex flex-col gap-6 mx-auto justify-center md:flex-row">
      <div className="min-w-[55%] w-full md:w-[55%]">
        <ImageGallery infinite showPlayButton={false} items={images} />
      </div>
      <div className="gap-y-3 flex flex-col mr-9 w-full md:max-w-[30%] md:w-fit">
        <div className="text-3xl font-bold mb-3">{listing.title}</div>
        <div className="text-2xl">Designer: {listing.designer}</div>
        <div className="text-2xl">Size: {listing.size}</div>
        <div className="text-2xl">Category: {listing.category}</div>
        <div className="text-2xl">Condition: {listing.condition}</div>
        {listing?.tags && (
          <div className="flex gap-2 flex-wrap mr-2">
            {tags.map((tag: string) => (
              <div
                key={tag}
                className="text-2xl w-fit border-main rounded-md text-main border py-1 px-2"
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
        <div className="text-3xl my-4 font-bold">{listing.price}₴</div>
        <Button variant="contained">Purchase</Button>
        {listing.description && (
          <div className="my-6">
            <div className="text-2xl font-semibold">Description</div>
            <div className="text-xl mt-2">{listing.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingRoute;
