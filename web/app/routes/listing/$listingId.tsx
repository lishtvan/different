import { useParams } from "@remix-run/react";

const ListingRoute = () => {
  const { listingId } = useParams();
  return <div>its listing page, current listing id is {listingId}</div>;
};

export default ListingRoute;
