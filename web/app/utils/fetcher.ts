import { redirect } from "@remix-run/node";

interface Fetcher {
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

export const fetcher: Fetcher = async ({
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

  if (response.status < 400) return response;

  if (response.status === 401 && route !== "/auth/check") {
    return redirect(`/?login=true`);
  }

  if (response.status === 404) throw new Response("", { status: 404 });
  if (response.status === 500) throw new Response("", { status: 500 });

  return response;
};
