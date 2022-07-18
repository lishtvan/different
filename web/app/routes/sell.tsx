import { Outlet } from "@remix-run/react";
import { fetchInstance } from "~/utils/fetchInstance";

export const loader = async ({ request }: { request: Request }) => {
  const response = await fetchInstance({
    request,
    method: "GET",
    route: "/",
  });
  return response;
};

const SellRoute = () => {
  return (
    <div>
      <h1>Sell</h1>
      <Outlet />
    </div>
  );
};

export default SellRoute;
