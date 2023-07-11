import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { InstantSearch } from "react-instantsearch-hooks-web";
import Header from "./components/ui/Header";
import Login from "./components/ui/Login";
import tailwindStylesUrl from "./styles/tailwind.css";
import { fetcher } from "./fetcher.server";
import { LISTINGS_COLLECTION_NAME } from "./constants/typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { useMemo } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
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

export const handle = { i18n: "common" };

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  defaultShouldRevalidate,
  formEncType,
}) => {
  if (
    currentUrl.pathname === "/user/edit" &&
    formEncType !== "multipart/form-data"
  ) {
    return false;
  }
  return defaultShouldRevalidate;
};

export const action: ActionFunction = async ({ request }) => {
  const { API_DOMAIN } = process.env;
  const cookie = request.headers.get("Cookie");
  if (!cookie) return API_DOMAIN;
  const tokenRow = cookie.split("; ").find((row) => row.startsWith("token"));
  if (!tokenRow) return API_DOMAIN;
  const response = await fetcher({
    request,
    method: "GET",
    route: "/auth/check",
  });

  if (response.status !== 401) {
    const formData = await request.formData();
    const route = formData.get("route")?.toString();

    return redirect(route!);
  }
  return API_DOMAIN;
};

export const loader: LoaderFunction = async ({ request }) => {
  const response = await fetcher({
    request,
    method: "GET",
    route: "/auth/check",
  });
  const user = await response.json();
  const ENV = process.env.ENVIRONMENT;
  const newHeaders = new Headers();
  if (user.statusCode === 401) {
    if (!request.url.includes("auth")) {
      newHeaders.append(
        "set-cookie",
        "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT, userId=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
      return json({ user: null, ENV }, { headers: newHeaders });
    }
    return json({ user: null, ENV });
  }

  const cookieHeader = response.headers.get("set-cookie");
  newHeaders.append("set-cookie", cookieHeader!);
  return json({ user, ENV }, { headers: newHeaders });
};

export default function App() {
  const [searchParams] = useSearchParams();
  const { user, ENV } = useLoaderData<RootLoaderData>();

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${config[ENV].wsDomain}/chat/message`,
    { shouldReconnect: () => Boolean(user) }
  );

  const { searchClient } = useMemo(() => {
    return new TypesenseInstantsearchAdapter({
      server: config[ENV].typesense,
      additionalSearchParameters: { query_by: "title,designer" },
    });
  }, []);

  return (
    <html lang={"uk"}>
      <head>
        <Meta />
        <Links />
      </head>
      <body
        className={`overflow-y-scroll px-3 ${
          searchParams.get("login") && "scrollbar"
        }`}
      >
        <InstantSearch
          indexName={LISTINGS_COLLECTION_NAME}
          searchClient={searchClient}
        >
          <Header />
          <Outlet context={{ sendMessage, lastMessage, readyState }} />
          {searchParams.get("login") && <Login />}
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
