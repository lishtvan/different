import { useEffect, useRef } from "react";
import { useInfiniteHits } from "react-instantsearch-hooks-web";
import type { TListing } from "~/types/listing";
import Listing from "./Listing";

const Listings = () => {
  const { hits, isLastPage, showMore } = useInfiniteHits<TListing>();
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      });

      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [isLastPage, showMore]);

  return (
    <div className="w-full grid mt-3 md:mt-0 xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-x-[1.125rem] gap-y-4">
      {hits.map((listing) => (
        <Listing listing={listing} key={listing.objectID} />
      ))}
      <div ref={sentinelRef} />
    </div>
  );
};

export default Listings;
