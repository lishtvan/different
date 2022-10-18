import { fetchInstance } from "./fetchInstance";

export const getAuthorizedStatus = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return false;
  const tokenRow = cookie.split("; ").find((row) => row.startsWith("token"));
  if (!tokenRow) return false;
  const user = await fetchInstance({
    request,
    method: "GET",
    route: "/auth/check",
  }).then((res) => res.json());
  return user;
};
