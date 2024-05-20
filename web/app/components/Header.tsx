import { useEffect } from "react";
import ig from "../assets/ig.png";
import tg from "../assets/tg.png";
import { Button } from "./ui/button";

function getOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("windows")) {
    return "Windows";
  } else if (userAgent.includes("macintosh") || userAgent.includes("mac os")) {
    return "MacOS";
  } else if (userAgent.includes("linux")) {
    return "Linux";
  } else if (
    userAgent.includes("iphone") ||
    userAgent.includes("ipad") ||
    userAgent.includes("ipod")
  ) {
    return "iOS";
  } else if (userAgent.includes("android")) {
    return "Android";
  } else {
    return "Unknown";
  }
}

const Header = () => {
  useEffect(() => {
    console.log(getOS());
  }, []);

  return (
    <header className="container absolute top-0 pt-3 flex w-full max-w-full justify-between">
      <div className="flex gap-x-0.5 mx-auto sm:mx-0">
        <h1 className="font-[1000] text-4xl">different</h1>
        <div className="rounded-full w-3 h-3 mt-auto mb-1.5 bg-main"></div>
      </div>
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
