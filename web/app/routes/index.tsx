import ClearFilters from "~/components/index/ClearFilters";
import SortBy from "~/components/index/SortBy";
import Filters from "~/components/index/filters";
import Listings from "~/components/index/listings/Listings";

const IndexRoute = () => {
  return (
    <div className="flex">
      <Filters />
      <div className="w-full mb-20 ml-0 sm:ml-4">
        <div className="py-2 mb-2 items-center hidden md:flex sticky top-16 bg-white z-40">
          <ClearFilters />
          <SortBy />
        </div>
        <Listings />
      </div>
    </div>
  );
};

export default IndexRoute;
