import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "react-router";

export const loader = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const newHeaders = new Headers();
  const formData = await request.formData();
  const language = formData.get("language");
  newHeaders.append(
    "Set-Cookie",
    `lng=${language}; Path=/; expires=Thu, 01 Jan 2030 00:00:00 GMT`
  );

  return json({}, { headers: newHeaders });
};
