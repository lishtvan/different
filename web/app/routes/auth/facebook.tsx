import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import { fetcher } from "~/utils/fetcher";

export const loader: LoaderFunction = async ({ request }) => {
  const { pathname, search } = new URL(request.url);
  const response = await fetcher({
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
