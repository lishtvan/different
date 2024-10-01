import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { fetcher } from "~/lib/fetcher";
import { openAppLink } from "~/lib/utils";

export const loader: LoaderFunction = async (data) => {
  const res = await fetcher({
    body: { nickname: data.params.nickname },
    route: "/user/get",
  });

  return res;
};

export const meta: MetaFunction<typeof loader> = (metaParams) => {
  const title = `${metaParams.data.nickname} | Профіль користувача Different`;
  const description = metaParams.data.bio;
  const keywords = "одяг, взуття, вінтаж, маркетплейс, мода, стиль, Україна";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:description", content: description },
    { property: "og:image", content: metaParams.data.avatarUrl },
    { name: "keywords", content: keywords },
    { httpEquiv: "X-UA-Compatible", content: "IE=edge" },
    { name: "robots", content: "index, follow" },
    { name: "language", content: "uk" },
    { property: "og:title", content: title },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: `https://different.to/user/${metaParams.data.nickname}`,
    },
  ];
};

const DEFAULT_AVATAR =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
const avatarFb = (url?: string) => url || DEFAULT_AVATAR;

export default function User() {
  const data = useLoaderData<any>();

  useEffect(() => {
    if (!data.nickname) return;
    openAppLink(`user/${data.nickname}`, true);
  }, [data.nickname]);

  return (
    <div className="h-dvh container flex justify-center items-center">
      <Card className=" bg-white px-4 sm:px-16">
        <CardContent>
          <CardHeader>
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarFb(data.avatarUrl)} />
            </Avatar>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="font-semibold text-xl">@{data.nickname}</div>
          </CardContent>
          <CardFooter className=" flex-col gap-y-2">
            <Button
              onClick={() => openAppLink(`user/${data.nickname}`)}
              className="w-full"
            >
              Відкрити в додатку
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
