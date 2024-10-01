import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_URL, IOS_STORE_URL } from "~/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPlatform = () => {
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  if (isiOS) return "ios";
  if (isAndroid) return "android";
  return "desktop";
};

export const openAppLink = (path?: string, effect?: boolean) => {
  const platform = getPlatform();
  if (platform === "android" || platform === "ios") {
    if (!path) window.location.href = APP_URL;
    else window.location.href = `${APP_URL}${path}`;
  } else if (effect) return;
  else window.location.href = IOS_STORE_URL;
};
