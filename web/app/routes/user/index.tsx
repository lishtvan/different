import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getCookieValue } from "~/utils/cookie";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getCookieValue("userId", request);
  if (!userId) redirect("/");
  return redirect(`/user/${userId}`);
};
