import { ThemeProvider } from "@emotion/react";
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
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
import { theme } from "./styles/theme";
import { fetchInstance } from "./utils/fetchInstance";
import {
  getTypesenseConfig,
  LISTINGS_COLLECTION_NAME,
} from "./constants/typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { getAuthorizedStatus } from "./utils/getAuthorizedStatus";
import i18next from "./i18next.server";
import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";

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

export const loader: LoaderFunction = async ({ request }) => {
  const typesenseConfig = getTypesenseConfig({ isWriteConfig: false });
  const response = await getAuthorizedStatus(request);
  if (!response) return { typesenseConfig, user: null };

  const cookieHeader = response.headers.get("set-cookie");
  const newHeaders = new Headers();
  newHeaders.append("set-cookie", cookieHeader!);
  const locale = await i18next.getLocale(request);
  return json(
    { user: await response.json(), typesenseConfig, locale },
    { headers: newHeaders }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const { API_DOMAIN } = process.env;
  const cookie = request.headers.get("Cookie");
  if (!cookie) return API_DOMAIN;
  const tokenRow = cookie.split("; ").find((row) => row.startsWith("token"));
  if (!tokenRow) return API_DOMAIN;
  const response = await fetchInstance({
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

export default function App() {
  const [searchParams] = useSearchParams();
  const { typesenseConfig } = useLoaderData();
  const { locale } = useLoaderData();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);

  const { searchClient } = new TypesenseInstantsearchAdapter({
    server: typesenseConfig,
    additionalSearchParameters: {
      query_by: "title,designer",
    },
  });

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="px-4">
        <ThemeProvider theme={theme}>
          <InstantSearch
            indexName={LISTINGS_COLLECTION_NAME}
            searchClient={searchClient}
          >
            <Header />
            <Outlet />
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

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="px-4">
        <ThemeProvider theme={theme}>
          <div className="w-full h-screen flex flex-col justify-center items-center">
            <div>
              <div className="bg-red-100 text-lg rounded-xl py-1 px-2 w-fit mb-3">
                Error {caught.status}
              </div>
              <div className="text-2xl mb-3">
                {caught.status === 404 && (
                  <span>
                    Page not found. Go to{" "}
                    <a
                      href={"/"}
                      className="text-blue-500 underline underline-offset-[5px]"
                    >
                      main page
                    </a>
                  </span>
                )}
                {caught.status === 500 && (
                  <>
                    <span>
                      Something went wrong on our side. <br /> Please, contact
                      support:{" "}
                      <a
                        className="text-blue-500 underline underline-offset-[5px]"
                        href="https://t.me/DifferentSupport"
                      >
                        @DifferentSupport
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
          <div className="w-full h-screen flex flex-col justify-center items-center">
            <div>
              <div className="bg-red-100 text-lg rounded-xl py-1 px-2 w-fit mb-3">
                Error 500
              </div>
              <div className="text-2xl mb-3">
                Something went wrong on our side.
                <br />
                <span>
                  Please, contact support:{" "}
                  <a
                    className="text-blue-500 underline underline-offset-[5px]"
                    href="https://t.me/DifferentSupport"
                  >
                    @DifferentSupport
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
