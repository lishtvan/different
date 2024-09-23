interface Fetcher {
  (input: {
    route: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: { [key: string]: unknown } | unknown;
  }): Promise<any>;
}

const baseURL = "https://api.different.to";
const headers = { "Content-type": "application/json" };

export const fetcher: Fetcher = async ({ route, body, method = "POST" }) => {
  const response = await fetch(`${baseURL}${route}`, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) throw response;
  const json = await response.json();
  return json;
};
