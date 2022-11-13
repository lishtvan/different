import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import { fetchInstance } from "~/utils/fetchInstance";

export const loader: LoaderFunction = async ({ request }) => {
  const { pathname, search } = new URL(request.url);
  const response = await fetchInstance({
    request,
    route: `${pathname}/callback${search}`,
    method: "GET",
  });
  return json(response, { headers: response.headers });
};

const AuthRoute = () => {
  useEffect(() => {
    window.close();
  }, []);

  return <></>;
};

export default AuthRoute;
