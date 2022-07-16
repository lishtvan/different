import { redirect } from "@remix-run/node";

interface FetchInstance {
  (input: {
    request: Request;
    route: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: {
      [key: string]: unknown;
    };
    headers?: Headers;
    domain?: string;
    authorization?: boolean;
  }): Promise<Response>;
}

export const fetchInstance: FetchInstance = async ({
  request,
  route,
  body,
  method,
  headers,
  domain = process.env.API_DOMAIN,
}) => {
  const response = await fetch(`${domain}${route}`, {
    method,
    headers: Object.assign(request.headers, headers),
    ...(body && { body: JSON.stringify(body) }),
  });
  if (response.status === 401 && route !== '/checkAuthorization') return redirect("/login");
  return response;
};
