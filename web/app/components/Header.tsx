import { ANDROID_STORE_URL, IOS_STORE_URL } from "~/constants";
import ig from "../assets/ig.png";
import tg from "../assets/tg.png";
import { Button } from "./ui/button";
import { Link } from "@remix-run/react";

const Header = () => {
  return (
    <header className="absolute top-0 pt-3 flex w-full max-w-full justify-between sm:container sm:absolute sm:top-0 sm:pt-3 sm:flex sm:w-full sm:max-w-full sm:justify-between">
      <Link
        unstable_viewTransition
        to="/"
        className="flex gap-x-0.5 pl-2 sm:pl-0"
      >
        <h1 className="font-[1000] text-4xl">different</h1>
        <div className="rounded-full w-3 h-3 mt-auto mb-1.5 bg-main"></div>
      </Link>
      <Button
        onClick={() => {
          const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isAndroid = /Android/.test(navigator.userAgent);

          if (isiOS || isAndroid) {
            window.location.href = isiOS ? IOS_STORE_URL : ANDROID_STORE_URL;
          }
        }}
        className="block mr-2 sm:hidden"
      >
        Завантажити
      </Button>
      <div className="hidden sm:flex">
        <Button
          asChild
          className="rounded-xl hover:bg-neutral-300 p-1"
          variant="ghost"
          size="icon"
        >
          <a
            target="_blank"
            href="https://www.instagram.com/different_mrktplc"
            rel="noreferrer"
          >
            <img width={40} height={40} src={ig} alt="instagram" />
          </a>
        </Button>
        <Button
          asChild
          className="rounded-xl hover:bg-neutral-300 p-1"
          variant="ghost"
          size="icon"
        >
          <a
            target="_blank"
            href="https://t.me/DifferentMarketplace"
            rel="noreferrer"
          >
            <img height={40} width={40} src={tg} alt="telegram" />
          </a>
        </Button>
      </div>
    </header>
  );
};

export default Header;
