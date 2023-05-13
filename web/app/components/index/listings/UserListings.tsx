import type { FC } from "react";
import { useEffect, useRef } from "react";
import {
  useClearRefinements,
  useInfiniteHits,
  useRefinementList,
} from "react-instantsearch-hooks-web";
import type { TListing } from "~/types";
import Listing from "./Listing";

interface Props {
  userId: number;
  showSold: boolean;
}

const UserListings: FC<Props> = ({ userId, showSold }) => {
  const { refine: refineStatus } = useRefinementList({ attribute: "status" });
  const { refine: refineSeller } = useRefinementList({ attribute: "sellerId" });
  const clear = useClearRefinements();
  const { hits, isLastPage, showMore, results } = useInfiniteHits<TListing>();
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    clear.refine();
    refineStatus(showSold ? "SOLD" : "AVAILABLE");
    refineSeller(userId.toString());
  }, [userId, showSold]);

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
    <div className="mb-20 mt-10 w-full px-0 md:px-24">
      {!results?.nbHits ? (
        <div className="flex h-44 items-center justify-center text-2xl font-semibold">
          <div>{showSold ? "No Items Sold Yet" : "No Listings Yet"} </div>
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-x-[1.125rem] gap-y-4 lg:grid-cols-3 xl:grid-cols-4">
          {hits.map((listing) => (
            <Listing listing={listing} key={listing.objectID} />
          ))}
          <div ref={sentinelRef} />
        </div>
      )}
    </div>
  );
};

export default UserListings;
