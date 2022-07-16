import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchInstance } from "~/utils/fetchInstance";

export const loader = async ({ request }: { request: Request }) => {
  const { API_DOMAIN } = process.env;
  const cookie = request.headers.get("Cookie");
  if (!cookie) return API_DOMAIN;
  const tokenRow = cookie.split("; ").find((row) => row.startsWith("token"));
  if (!tokenRow) return API_DOMAIN;
  const response = await fetchInstance({
    request,
    method: "GET",
    route: "/checkAuthorization",
  });
  if (response.status !== 401) return redirect("/");
  return API_DOMAIN;
};

const LoginRoute = () => {
  const API_DOMAIN = useLoaderData();

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        textAlign: "center",
      }}
    >
      <h1>Welcome to Login</h1>
      <div>
        <a href={`${API_DOMAIN}/auth/google`}>Sign in with google</a>
      </div>
    </div>
  );
};

export default LoginRoute;
