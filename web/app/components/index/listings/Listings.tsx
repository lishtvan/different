import { useHits } from "react-instantsearch-hooks-web";
import type { TListing } from "~/types/listing";
import Listing from "./Listing";

const Listings = () => {
  const { hits } = useHits<TListing>();

  return (
    <div className="h-fit w-full grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 mb-8 ml-4 gap-x-[1.125rem] gap-y-4 auto-rows-auto">
      {hits.map((listing) => (
        <Listing listing={listing} key={listing.objectID} />
      ))}
    </div>
  );
};

export default Listings;
