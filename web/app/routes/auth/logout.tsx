import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { fetcher } from "~/utils/fetcher";

export const loader = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const response = await fetcher({
    request,
    route: "/auth/logout",
    method: "POST",
  });

  return redirect("/", { headers: response.headers });
};
