import { fetcher } from "./fetcher";

export const getAuthorizedStatus = (request: Request) =>
  fetcher({
    request,
    method: "GET",
    route: "/auth/check",
  });
