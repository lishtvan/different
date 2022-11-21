import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useRefinementList } from "react-instantsearch-hooks-web";
import Listings from "~/components/index/listings/Listings";

const UserListings = () => {
  const { refine: refineStatus } = useRefinementList({ attribute: "status" });
  const { refine: refineSeller } = useRefinementList({ attribute: "sellerId" });
  const { userId } = useParams();
  useEffect(() => {
    if (!userId) return;
    refineStatus("AVAILABLE");
    refineSeller(userId);
  }, []);

  return (
    <div className="mt-10 mb-20 w-full px-0 md:px-24">
      <Listings />
    </div>
  );
};

export default UserListings;
