import type { MetaFunction } from "@remix-run/node";
import ios from "../assets/ios.png";
import android from "../assets/android.png";

import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";

export const meta: MetaFunction = () => {
  return [
    { title: "Different" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="h-screen container flex items-center justify-center">
      <div className=" flex items-center gap-x-40">
        <div className="flex flex-col">
          <h1 className="font-bold leading-tight tracking-tighter md:text-2xl lg:leading-[1.1]">
            Different - маркетплейс для одягу, взуття <br /> та аксесуарів
          </h1>
          <p className="max-w-[750px] mt-3 text-lg text-muted-foreground sm:text-xl">
            Швидкі продажі та зручний пошук того, що вам потрібно.
            <br />
            Захищенність покупців та продавців.
            <br />
            Речі на будь-який смак - Vintage, New collections, <br /> Custom,
            Streatwear, Outdoor.
          </p>
          <div className="flex items-center mt-10">
            <Button size="lg" className="w-fit">
              Завантажити додаток
            </Button>
            <Icons.apple className="h-8 w-8 ml-4 min-h-8 min-w-8" />
            <img
              src={android}
              className="w-11 h-11 ml-1 mt-0.5"
              alt="android"
            />
          </div>
        </div>
        <img width={330} src={ios} alt="phone" />
      </div>
    </div>
  );
}
