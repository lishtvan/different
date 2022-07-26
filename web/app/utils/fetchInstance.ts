import { redirect } from "@remix-run/node";

interface FetchInstance {
  (input: {
    request: Request;
    route: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?:
      | {
          [key: string]: unknown;
        }
      | null
      | FormData;
    formData?: boolean;
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
  formData = false,
  method,
  domain = process.env.API_DOMAIN,
}) => {
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) headers.append("Cookie", cookie);

  let response;
  if (body) {
    let formattedBody;
    if (!formData) {
      headers.append("Content-type", "application/json");
      formattedBody = JSON.stringify(body);
    } else if (body instanceof FormData) {
      formattedBody = body;
    } else formattedBody = null;

    response = await fetch(`${domain}${route}`, {
      method,
      headers,
      body: formattedBody,
    });
  } else response = await fetch(`${domain}${route}`, { method, headers });

  if (response.status === 401 && route !== "/auth/check") {
    const origin = getOriginUrl(request);

    return redirect(`/${origin}?login=true`);
  }
  return response;
};
