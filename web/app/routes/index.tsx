import { redirect } from "@remix-run/node";

export const loader = async ({ request }: { request: Request }) => {
  return redirect("/home");
};
