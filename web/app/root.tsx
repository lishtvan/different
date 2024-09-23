import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import "../public/fonts/GeistVariableVF.woff2";
import styles from "./tailwind.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  return (
    <html lang="en" className="font-sans">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <Header />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error: any = useRouteError();
  return (
    <html>
      <head>
        <title>Different</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <div className="h-screen container flex justify-center items-center">
          <div>
            <div className="mb-3 w-fit font-semibold rounded-xl bg-red-100 px-2 py-1 text-lg">
              Error {error.status}
            </div>
            <div className="mb-3 text-xl">
              {error.status === 404 && <span>Сторінку не знайдено.</span>}
              {error.status === 500 && (
                <span>
                  Щось пішло не так з нашої сторони. <br /> Будь ласка,
                  зверніться в пітримку.
                  <br />
                  <a
                    className="text-blue-500 underline underline-offset-[5px]"
                    href="https://t.me/DifferentMarketplace"
                  >
                    @DifferentMarketplace
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
