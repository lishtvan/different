import { fetchInstance } from "./fetchInstance";

export const getAuthorizedStatus = async (request: Request) => {
  const user = await fetchInstance({
    request,
    method: "GET",
    route: "/auth/check",
  });
  return user;
};
