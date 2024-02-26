import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import { InstantSearch } from "react-instantsearch-hooks-web";
import Header from "./components/ui/Header";
import tailwindStylesUrl from "./styles/tailwind.css";
import { LISTINGS_COLLECTION_NAME } from "./constants/typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { useMemo } from "react";
import { config } from "./constants/config";
import type { RootLoaderData } from "./types";
import ErrorBoundaryComponent from "./components/platform/ErrorBoundary";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesUrl },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Different",
  descriptiom: "Second-hand marketplace",
  viewport: "width=device-width,initial-scale=1,viewport-fit=cover",
});

export const loader: LoaderFunction = async ({ request }) => {
  const ENV = process.env.ENVIRONMENT;
  return json({ ENV });
};

export default function App() {
  const { ENV } = useLoaderData<RootLoaderData>();

  const { searchClient } = useMemo(() => {
    return new TypesenseInstantsearchAdapter({
      server: config[ENV].typesense,
      additionalSearchParameters: { query_by: "title,designer" },
    });
  }, []);
  // useEffect(() => {
  //   const now = new Date().valueOf();
  //   setTimeout(() => {
  //     if (new Date().valueOf() - now > 100) return;
  //     window.location.href = "different://";
  //   }, 2);
  //   try {
  //     window.location.href = "differentwwq://";
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);
  return (
    <html lang={"uk"}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="px-3">
        <InstantSearch
          indexName={LISTINGS_COLLECTION_NAME}
          searchClient={searchClient}
        >
          <Header />
          <Outlet />
        </InstantSearch>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <html lang="uk">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="px-4">
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <div>
            <div className="mb-3 w-fit rounded-xl bg-red-100 px-2 py-1 text-lg">
              Error {caught.status}
            </div>
            <div className="mb-3 text-2xl">
              {caught.status === 404 && (
                <span>
                  Page not found. <br />
                </span>
              )}
              {caught.status === 500 && (
                <span>
                  Something went wrong on our side. <br /> Please, contact
                  support:{" "}
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
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="uk">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="px-4">
        <ErrorBoundaryComponent root={true} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
