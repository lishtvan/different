import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { fetchInstance } from "~/utils/fetchInstance";

export const loader = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const response = await fetchInstance({
    request,
    route: "/auth/logout",
    method: "POST",
  });

  return redirect("/", { headers: response.headers });
};
