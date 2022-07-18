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

const getOriginUrl = (request: Request) => {
  const arr = request.url.split(process.env.APP_DOMAIN!!)[1].split("/");
  if (arr[arr.length - 1] === "") arr.pop();
  arr.pop();
  const url = arr.join("");
  return url;
};

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

  if (response.status === 401 && route !== "/auth/check") {
    const origin = getOriginUrl(request);

    return redirect(`/${origin || 'home'}?login=true`);
  }
  return response;
};
