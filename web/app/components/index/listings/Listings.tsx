import { useHits } from "react-instantsearch-hooks-web";
import type { TListing } from "~/types/listing";
import ClearFilters from "../ClearFilters";
import SortBy from "../SortBy";
import Listing from "./Listing";

const Listings = () => {
  const { hits } = useHits<TListing>();

  return (
    <div className="w-full mb-8 ml-0 sm:ml-4">
      <div className="py-2 mb-2 items-center hidden md:flex sticky top-[4.5rem] bg-white">
        <ClearFilters />
        <SortBy />
      </div>
      <div className="h-fit w-full grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-x-[1.125rem] gap-y-4">
        {hits.map((listing) => (
          <Listing listing={listing} key={listing.objectID} />
        ))}
      </div>
    </div>
  );
};

export default Listings;
