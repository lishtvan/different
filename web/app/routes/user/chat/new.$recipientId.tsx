import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { fetchInstance } from "~/utils/fetchInstance";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { recipientId } = params;

  const response = await fetchInstance({
    request,
    method: "POST",
    body: { recipientId: Number(recipientId) },
    route: "/chat/create",
  });
  if (response.status === 302) return response;
  const { chatId } = await response.json();
  return redirect(`/user/chat/${chatId}`);
};
