import Filters from "~/components/index/filters";
import Listings from "~/components/index/listings/Listings";

const IndexRoute = () => {
  return (
    <div className="flex">
      <Filters />
      <Listings />
    </div>
  );
};

export default IndexRoute;
