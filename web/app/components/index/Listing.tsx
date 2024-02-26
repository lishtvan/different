import type { FC } from "react";
import type { TListing } from "~/types";

interface Props {
  listing: TListing;
}

const Listing: FC<Props> = ({ listing }) => {
  return <div>listing</div>;
};

export default Listing;
