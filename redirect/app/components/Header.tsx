import tg from "../assets/ig.png";
import ig from "../assets/tg.png";

const Header = () => {
  // function getOS() {
  //   const userAgent = navigator.userAgent.toLowerCase();
  //   if (userAgent.includes("windows")) {
  //     return "Windows";
  //   } else if (
  //     userAgent.includes("macintosh") ||
  //     userAgent.includes("mac os")
  //   ) {
  //     return "MacOS";
  //   } else if (userAgent.includes("linux")) {
  //     return "Linux";
  //   } else if (
  //     userAgent.includes("iphone") ||
  //     userAgent.includes("ipad") ||
  //     userAgent.includes("ipod")
  //   ) {
  //     return "iOS";
  //   } else if (userAgent.includes("android")) {
  //     return "Android";
  //   } else {
  //     return "Unknown";
  //   }
  // }

  // console.log("Operating System:", getOS());

  return (
    <header className="container absolute top-0 pt-3 flex w-full max-w-full justify-between">
      <div className="flex gap-x-0.5  mx-auto sm:mx-0">
        <h1 className="font-[1000] text-4xl">different</h1>
        <div className="rounded-full w-3 h-3 mt-auto mb-1.5 bg-main"></div>
      </div>
      <div className="hidden sm:flex gap-x-2">
        <img className="w-8 h-8" src={tg} alt="telegram" />
        <img className="w-8 h-8" src={ig} alt="instagram" />
      </div>
    </header>
  );
};

export default Header;
