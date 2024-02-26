import type { LoaderFunction } from "@remix-run/node";
import { fetcher } from "~/fetcher.server";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";

export const loader: LoaderFunction = async ({ request, params }) => {
  const listingId = Number(params.listingId);

  const response = await fetcher({
    request,
    route: "/listing/get",
    method: "POST",
    body: { listingId },
  }).then((res) => res.json());

  return response;
};

const ListingRoute = () => {
  return <div>listing page</div>;
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
export default ListingRoute;
