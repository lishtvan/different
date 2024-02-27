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
    <div className="h-screen container px-2 sm:px-2 flex items-center justify-center">
      <div className="flex items-center justify-center gap-x-20 sm:gap-x-8 md:gap-x-8 lg:gap-x-32 xl:gap-x-40">
        <div className="flex flex-col max-w-[450px]">
          <h1 className="mx-auto max-w-[300px] text-center text-base font-bold leading-tight tracking-tighter md:text-2xl lg:leading-[1.1] sm:text-start sm:max-w-full sm:mx-0">
            Different - маркетплейс для одягу, взуття та аксесуарів
          </h1>
          <p className="text-center mt-3 text-sm text-muted-foreground lg:text-xl md:text-base sm:text-sm sm:text-start">
            Швидкий, зручний, сучасний додаток для IOS та Android. Захищеність
            покупців та продавців. Гнучкі фільтри пошуку, чат, трекінг
            замовлення та багато іншого.
          </p>
          <div className="flex items-center mt-10 gap-x-2 flex-col gap-y-5 sm:flex-row justify-center sm:justify-start">
            <Button size="lg" className="w-fit">
              Завантажити додаток
            </Button>
            <div className="flex items-center">
              <Icons.apple className="h-8 w-8 min-h-8 min-w-8" />
              <img
                src={android}
                className="w-11 h-11 ml-1 mt-0.5"
                alt="android"
              />
            </div>
          </div>
        </div>
        <img
          className="hidden sm:block sm:w-[220px] md:w-1/3 lg:w-1/4 xl:w-1/4"
          width={330}
          src={ios}
          alt="phone"
        />
      </div>
    </div>
  );
}
