import type { MetaFunction } from "@remix-run/node";
import { Icons } from "~/components/ui/icons";
import ios from "~/assets/ios-screen.webp";
import { useEffect } from "react";
import { getPlatform } from "~/lib/utils";
import { ANDROID_STORE_URL, IOS_STORE_URL } from "~/constants";

export const meta: MetaFunction = () => {
  const title = "Different - маркетплейс для одягу, взуття та аксесуарів";
  const description = "Продається одяг - купується індивідуальність.";
  const keywords = "одяг, взуття, вінтаж, маркетплейс, мода, стиль, Україна";

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { httpEquiv: "X-UA-Compatible", content: "IE=edge" },
    { name: "robots", content: "index, follow" },
    { name: "language", content: "uk" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://different.to" }, // Replace with your actual URL
    {
      property: "og:image",
      content:
        "https://s3.eu-central-1.amazonaws.com/different.prod/-7KEwU25S5aqL3NP_n4uPw-0.webp",
    },
  ];
};

export default function Index() {
  useEffect(() => {
    const platform = getPlatform();
    if (platform === "android") window.location.href = ANDROID_STORE_URL;
    if (platform === "ios") window.location.href = IOS_STORE_URL;
  }, []);

  return (
    <div className="h-dvh container px-2 sm:px-2 flex items-center justify-center">
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
          <div className="flex items-center mt-10 gap-x-3 flex-row justify-center sm:justify-start">
            <a href={IOS_STORE_URL}>
              <Icons.appStore className="max-w-full" />
            </a>
            <a href={ANDROID_STORE_URL}>
              <Icons.googlePlay className="max-w-full" />
            </a>
          </div>
        </div>
        <div className="hidden sm:block sm:w-[220px] md:w-1/3 lg:w-[22%] xl:w-1/5">
          <img
            className="w-full"
            src={ios}
            width={300}
            height={612}
            alt="phone"
          />
        </div>
      </div>
    </div>
  );
}
