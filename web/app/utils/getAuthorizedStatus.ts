import { fetchInstance } from "./fetchInstance";

export const getAuthorizedStatus = (request: Request) =>
  fetchInstance({
    request,
    method: "GET",
    route: "/auth/check",
  });
