import { Tooltip } from "@mui/material";
import { Link } from "@remix-run/react";
import type { FC } from "react";
import { SHORT_SIZES } from "~/constants/listing";
import type { TListing } from "~/types/listing";

interface Props {
  listing: TListing;
}

const Listing: FC<Props> = ({ listing }) => {
  return (
    <Link
      to={`/listing/${listing.id}`}
      target="_blank"
      className="h-fit rounded-md border"
    >
      <div>
        <img
          className="aspect-[9.4/10] w-full rounded-t-md object-cover"
          src={`${listing.imageUrls[0]}`}
          loading="lazy"
          alt="item"
        />
        <div className="px-2">
          <div className="mt-3 flex justify-between overflow-hidden">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold">
              {listing.designer}
            </div>
            <div className="ml-1 whitespace-nowrap text-sm">
              {SHORT_SIZES[listing.size]}
            </div>
          </div>
          <Tooltip
            disableInteractive
            title={<p className="text-sm">{listing.title}</p>}
          >
            <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
              {listing.title}
            </div>
          </Tooltip>
          <div
            className={`my-2 text-sm font-bold ${
              listing.status === "SOLD" && "text-main"
            }`}
          >
            {listing.price} ₴ {listing.status === "SOLD" && "(Sold price)"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Listing;
