import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { fetcher } from "~/fetcher.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { recipientId } = params;
  const url = new URL(request.url);
  const relatedListingId = url.searchParams.get("relatedListingId");
  const relatedListingTitle = url.searchParams.get("relatedListingTitle");

  const response = await fetcher({
    request,
    method: "POST",
    body: { recipientId: Number(recipientId) },
    route: "/chat/create",
  });
  if (response.status === 302) return response;
  const { chatId } = await response.json();
  if (relatedListingId && relatedListingTitle) {
    return redirect(
      `/user/chat/${chatId}?relatedListingId=${relatedListingId}&relatedListingTitle=${encodeURIComponent(
        relatedListingTitle
      )}`
    );
  }
  return redirect(`/user/chat/${chatId}`);
};
