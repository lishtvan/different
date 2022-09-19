import { useHits } from "react-instantsearch-hooks-web";
import Listing from "./Listing";

const Listings = () => {
  const { hits } = useHits();

  return (
    <div className="lg:grid-cols-4 md:grid-cols-3 grid-cols-2 mb-8 ml-4 w-full grid gap-x-[1.125rem] gap-y-4">
      {hits.map((listing: any) => (
        <Listing listing={listing} key={listing.objectID} />
      ))}
    </div>
  );
};

export default Listings;
