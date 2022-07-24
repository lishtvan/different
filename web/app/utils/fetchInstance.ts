import { redirect } from "@remix-run/node";

interface FetchInstance {
  (input: {
    request: Request;
    route: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: BodyInit;
    contentType?: "multipart/form-data" | "application/json";
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
  contentType,
  method,
  domain = process.env.API_DOMAIN,
}) => {
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) headers.append("Cookie", cookie);
  if (!contentType) headers.append("Content-type", "application/json");

  if (method === "POST") {
    const response = await fetch(`${domain}${route}`, {
      method,
      headers,
      body,
    });
    if (response.status === 401 && route !== "/auth/check") {
      const origin = getOriginUrl(request);

      return redirect(`/${origin}?login=true`);
    }
    return response;
  } else {
    const response = await fetch(`${domain}${route}`, {
      method,
      headers,
    });
    if (response.status === 401 && route !== "/auth/check") {
      const origin = getOriginUrl(request);

      return redirect(`/${origin}?login=true`);
    }
    return response;
  }
};
