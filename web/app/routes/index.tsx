import ClearFilters from "~/components/index/ClearFilters";
import SortBy from "~/components/index/SortBy";
import Filters from "~/components/index/filters";
import Listings from "~/components/index/listings/Listings";

const IndexRoute = () => {
  return (
    <div className="flex">
      <Filters />
      <div className="mb-20 ml-0 w-full sm:ml-4">
        <div className="sticky top-16 z-40 mb-2 hidden items-center bg-white py-2 md:flex">
          <ClearFilters />
          <SortBy />
        </div>
        <Listings />
      </div>
    </div>
  );
};

export default IndexRoute;
