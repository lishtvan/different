import { Tooltip } from "@mui/material";
import { Link } from "@remix-run/react";
import { SHORT_SIZES } from "~/constants/listing";

const Listing = ({ listing }: { listing: any }) => {
  return (
    <Link to="/sell/2">
      <div className="h-fit border rounded-md">
        <img
          className="w-full aspect-[9.4/10] rounded-t-md object-cover"
          src={`${listing.imageUrls[0]}`}
          loading="lazy"
          alt="item"
        />
        <div className="px-2">
          <div className="mt-3 flex overflow-hidden justify-between">
            <div className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] md:max-w-[130px] 2xl:max-w-full lg:max-w-[135px] xl:max-w-[185px]">
              {listing.designer}
            </div>
            <div className="text-sm whitespace-nowrap text-ellipsis overflow-hidden">
              {/* @ts-ignore */}
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
          <div className="text-sm font-bold my-2">{listing.price} ₴</div>
        </div>
      </div>
    </Link>
  );
};

export default Listing;