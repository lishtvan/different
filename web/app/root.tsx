import { ThemeProvider } from "@emotion/react";
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { InstantSearch } from "react-instantsearch-hooks-web";
import Header from "./components/ui/Header";
import Login from "./components/ui/Login";
import tailwindStylesUrl from "./styles/tailwind.css";
import { theme } from "./styles/theme";
import { fetchInstance } from "./utils/fetchInstance";
import { getAuthorizedStatus } from "./utils/getAuthorizedStatus";
import {
  getTypesenseConfig,
  LISTINGS_COLLECTION_NAME,
} from "./constants/typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesUrl },
  { rel: "icon", href: "favicon.ico" },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Different",
  descriptiom: "Second-hand marketplace",
  viewport: "width=device-width,initial-scale=1,viewport-fit=cover",
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getAuthorizedStatus(request);
  return {
    user,
    typesenseConfig: getTypesenseConfig({ isWriteConfig: false }),
  };
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

  const { searchClient } = new TypesenseInstantsearchAdapter({
    server: typesenseConfig,
    additionalSearchParameters: {
      query_by: "title,designer",
    },
  });

  return (
    <html lang="en">
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
