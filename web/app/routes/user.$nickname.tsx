import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { fetcher } from "~/lib/fetcher";

export const meta: MetaFunction = (data) => {
  return [
    { title: `Different - @${data.params.nickname} ` },
    {
      name: "description",
      content: "Маркетплейс для одягу, взуття та аксесуарів",
    },
  ];
};

export const loader: LoaderFunction = async (data) => {
  const res = await fetcher({
    body: { nickname: data.params.nickname },
    route: "/user/get",
  });

  return res;
};

const DEFAULT_AVATAR =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
const avatarFb = (url?: string) => url || DEFAULT_AVATAR;

export default function User() {
  const data = useLoaderData<any>();
  return (
    <div className="h-screen container flex justify-center items-center">
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
            <Button className="w-full">Відкрити в додатку</Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
