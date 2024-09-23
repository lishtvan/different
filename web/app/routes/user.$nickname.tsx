import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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

export default function User() {
  const data = useLoaderData();
  return (
    <div className="h-screen container flex justify-center items-center">
      {JSON.stringify(data, null, 2)}
    </div>
  );
}
