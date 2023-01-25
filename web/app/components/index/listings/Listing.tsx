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
      className="h-fit border rounded-md"
    >
      <div>
        <img
          className="w-full aspect-[9.4/10] rounded-t-md object-cover"
          src={`${listing.imageUrls[0]}`}
          loading="lazy"
          alt="item"
        />
        <div className="px-2">
          <div className="mt-3 flex overflow-hidden justify-between">
            <div className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis">
              {listing.designer}
            </div>
            <div className="text-sm whitespace-nowrap ml-1">
              {SHORT_SIZES[listing.size]}
            </div>
          </div>
          <Tooltip
            disableInteractive
            title={<p className="text-sm">{listing.title}</p>}
          >
            <div className="text-sm mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {listing.title}
            </div>
          </Tooltip>
          <div
            className={`text-sm font-bold my-2 ${
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
