import { useEffect } from "react";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const { search } = new URL(request.url);
  const searchParams = new URLSearchParams(search);
  const token = searchParams.get("token");
  const domain =
    process.env.ENVIRONMENT === "local"
      ? "localhost"
      : ".different-marketplace.com";
  const newHeaders = new Headers();
  newHeaders.append(
    "set-cookie",
    `token=${token}; Max-Age=43200000; Domain=${domain}; Path=/; HttpOnly; Secure`
  );
  return new Response("", { headers: newHeaders });
};

const AuthRoute = () => {
  useEffect(() => {
    window.close();
  }, []);
  return <></>;
};

export default AuthRoute;
