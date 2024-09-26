import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { fetcher } from "~/lib/fetcher";

export const loader: LoaderFunction = async (data) => {
  const res = await fetcher({
    body: { listingId: data.params.id },
    route: "/listing/get",
  });

  return res;
};

export const meta: MetaFunction<typeof loader> = (metaParams) => {
  const title = metaParams.data.listing.title;
  const description = metaParams.data.listing.description;
  const keywords = "одяг, взуття, вінтаж, маркетплейс, мода, стиль, Україна";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:description", content: description },
    { property: "og:image", content: metaParams.data.listing.imageUrls[0] },
    { name: "keywords", content: keywords },
    { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
    { name: "robots", content: "index, follow" },
    { name: "language", content: "uk" },
    { property: "og:title", content: title },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: `https://different.to/listing/${metaParams.data.listing.id}`,
    },
  ];
};

export default function User() {
  const { listing } = useLoaderData<any>();
  return (
    <div className="min-h-screen  container flex justify-center items-center">
      <Card className="bg-white max-w-[200px] xs:max-w-[300px]">
        <img
          src={listing.imageUrls[0]}
          alt="Listing"
          className="w-full rounded-t-lg aspect-[0.83] object-cover"
        />
        <CardContent className="pb-3 xs:pb-6 flex flex-col justify-center items-center">
          <div className="py-2">
            <p className="text-xs xs:text-base">
              Vintage Guns N Roses Appetite For Destruction T-shirt
            </p>
            <div className="hidden my-2 xl:block text-muted-foreground">
              <div>Дизайнер: {listing.designer}</div>
              <div>Розмір: {listing.size}</div>
              <div>Стан: {listing.condition}</div>
            </div>
          </div>
          <Button size={"sm"} className="w-full text-xs xs:text-base">
            Відкрити в додатку
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
