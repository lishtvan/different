import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { fetcher } from "~/fetcher.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { recipientId } = params;

  const response = await fetcher({
    request,
    method: "POST",
    body: { recipientId: Number(recipientId) },
    route: "/chat/create",
  });
  if (response.status === 302) return response;
  const { chatId } = await response.json();
  return redirect(`/user/chat/${chatId}`);
};
