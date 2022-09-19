import Filters from "~/components/index/filters";
import Listings from "~/components/index/listings/Listings";

const IndexRoute = () => {
  return (
    <div className="mt-2 flex h-5/6">
      <Filters />
      <Listings />
    </div>
  );
};

export default IndexRoute;
