import { useEffect } from "react";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const { search } = new URL(request.url);
  const searchParams = new URLSearchParams(search);
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const newHeaders = new Headers();
  newHeaders.append("set-cookie", `token=${token}`);
  newHeaders.append("set-cookie", `userId=${userId}`);
  return new Response("", { headers: newHeaders });
};

const AuthRoute = () => {
  useEffect(() => {
    window.close();
  }, []);
  return <></>;
};

export default AuthRoute;
