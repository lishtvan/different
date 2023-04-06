import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { InstantSearch } from "react-instantsearch-hooks-web";
import Header from "./components/ui/Header";
import Login from "./components/ui/Login";
import tailwindStylesUrl from "./styles/tailwind.css";
import { theme } from "./styles/theme";
import { fetcher } from "./utils/fetcher";
import { LISTINGS_COLLECTION_NAME } from "./constants/typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { getAuthorizedStatus } from "./utils/getAuthorizedStatus";
import i18next from "./i18next.server";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { ThemeProvider } from "@mui/material";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { config } from "./constants/envConfig";
import type { RootLoaderData } from "./types/rootLoader";

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
  const [response, locale] = await Promise.all([
    getAuthorizedStatus(request),
    i18next.getLocale(request),
  ]);
  const user = await response.json();
  const ENV = process.env.ENVIRONMENT;
  const newHeaders = new Headers();
  if (user.statusCode === 401) {
    if (!request.url.includes("auth")) {
      newHeaders.append(
        "set-cookie",
        "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT, userId=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
      return json({ user: null, locale, ENV }, { headers: newHeaders });
    }

    return json({ user: null, locale, ENV });
  }

  const cookieHeader = response.headers.get("set-cookie");
  newHeaders.append("set-cookie", cookieHeader!);
  return json({ user, locale, ENV }, { headers: newHeaders });
};

export default function App() {
  const [searchParams] = useSearchParams();
  const { user, locale, ENV } = useLoaderData<RootLoaderData>();
  const { i18n } = useTranslation();

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${config[ENV].wsDomain}/chat/message`,
    { shouldReconnect: () => Boolean(user) }
  );

  // TODO: update later
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  const { searchClient } = useMemo(() => {
    return new TypesenseInstantsearchAdapter({
      server: config[ENV].typesense,
      additionalSearchParameters: { query_by: "title,designer" },
    });
  }, []);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body
        className={`overflow-y-scroll px-3 ${
          searchParams.get("login") && "scrollbar"
        }`}
      >
        <ThemeProvider theme={theme}>
          <InstantSearch
            indexName={LISTINGS_COLLECTION_NAME}
            searchClient={searchClient}
          >
            <Header />
            <Outlet context={{ sendMessage, lastMessage, readyState }} />
            {searchParams.get("login") && <Login />}
          </InstantSearch>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const navigate = useNavigate();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="px-4">
        <ThemeProvider theme={theme}>
          <div className="flex h-screen w-full flex-col items-center justify-center">
            <div>
              <div className="mb-3 w-fit rounded-xl bg-red-100 py-1 px-2 text-lg">
                Error {caught.status}
              </div>
              <div className="mb-3 text-2xl">
                {caught.status === 404 && (
                  <>
                    <span>
                      Page not found.{" "}
                      <button
                        onClick={() => navigate(-1)}
                        className="text-blue-500 underline underline-offset-[5px]"
                      >
                        Go back
                      </button>
                    </span>
                    <br />
                    <span>
                      Go to{" "}
                      <a
                        href={"/"}
                        className="text-blue-500 underline underline-offset-[5px]"
                      >
                        main page
                      </a>
                    </span>
                  </>
                )}
                {caught.status === 500 && (
                  <>
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
                    <br />
                    <span>
                      Return to{" "}
                      <a
                        href={caught.data}
                        className="text-blue-500 underline underline-offset-[5px]"
                      >
                        previous page
                      </a>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="px-4">
        <ThemeProvider theme={theme}>
          <div className="flex h-screen w-full flex-col items-center justify-center">
            <div>
              <div className="mb-3 w-fit rounded-xl bg-red-100 py-1 px-2 text-lg">
                Error 500
              </div>
              <div className="mb-3 text-2xl">
                Something went wrong on our side.
                <br />
                <span>
                  Please, contact support:{" "}
                  <a
                    className="text-blue-500 underline underline-offset-[5px]"
                    href="https://t.me/DifferentMarketplace"
                  >
                    @DifferentMarketplace
                  </a>
                </span>
                <br />
                <span>
                  Return to{" "}
                  <a
                    href={window.location.href}
                    className="text-blue-500 underline underline-offset-[5px]"
                  >
                    previous page
                  </a>
                </span>
              </div>
            </div>
          </div>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
