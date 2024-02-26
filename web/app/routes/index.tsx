import Listings from "~/components/index/Listings";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";

const IndexRoute = () => {
  return (
    <div className="flex">
      <Listings />
    </div>
  );
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
export default IndexRoute;
