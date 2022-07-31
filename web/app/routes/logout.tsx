import type { ActionFunction } from "@remix-run/node";
import { createCookie } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { fetchInstance } from "~/utils/fetchInstance";

export const loader = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  await fetchInstance({
    request,
    route: "/auth/logout",
    method: "POST",
  });
  const token = createCookie("token", {
    expires: new Date("2021-01-01"),
  });
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await token.parse(cookieHeader);
  return redirect("/", {
    headers: {
      "Set-Cookie": await token.serialize(cookie),
    },
  });
};
