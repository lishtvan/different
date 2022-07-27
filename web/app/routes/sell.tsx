import { Outlet } from "@remix-run/react";

const SellRoute = () => {
  return (
    <div>
      <h1>Sell</h1>
      <Outlet />
    </div>
  );
};

export default SellRoute;
