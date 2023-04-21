import { fetcher } from "../fetcher.server";

export const getAuthorizedStatus = (request: Request) =>
  fetcher({
    request,
    method: "GET",
    route: "/auth/check",
  });
