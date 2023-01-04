import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { fetchInstance } from "~/utils/fetchInstance";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { recipientId } = params;

  const { chatId } = await fetchInstance({
    request,
    method: "POST",
    body: { recipientId: Number(recipientId) },
    route: "/chat/create",
  }).then((res) => res.json());
  return redirect(`/user/chat/${chatId}`);
};
