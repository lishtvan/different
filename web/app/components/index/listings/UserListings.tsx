import { useParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import {
  useClearRefinements,
  useInfiniteHits,
  useRefinementList,
} from "react-instantsearch-hooks-web";
import type { TListing } from "~/types/listing";
import Listing from "./Listing";

const UserListings = () => {
  const { refine: refineStatus } = useRefinementList({ attribute: "status" });
  const { refine: refineSeller } = useRefinementList({ attribute: "sellerId" });
  const clear = useClearRefinements();
  const { hits, isLastPage, showMore, results } = useInfiniteHits<TListing>();
  const sentinelRef = useRef(null);
  const { userId } = useParams();

  useEffect(() => {
    if (!userId) return;
    clear.refine();
    refineStatus("AVAILABLE");
    refineSeller(userId);
  }, [userId]);

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
    <div className="mt-10 mb-20 w-full px-0 md:px-24">
      {results?.nbHits! > 0 ? (
        <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-x-[1.125rem] gap-y-4">
          {hits.map((listing) => (
            <Listing listing={listing} key={listing.objectID} />
          ))}
          <div ref={sentinelRef} />
        </div>
      ) : (
        <div className="text-xl h-44 flex items-center justify-center font-semibold">
          <div>The are no listings for now</div>
          <div className="ml-2 text-4xl">&#128546;</div>
        </div>
      )}
    </div>
  );
};

export default UserListings;
