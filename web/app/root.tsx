import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
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

import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import Header from "./components/Header";
import Login from "./components/Login";
import { MAIN_COLOR, DARK_COLOR } from "./constants/styles";
import tailwindStylesUrl from "./styles/tailwind.css";
import { fetchInstance } from "./utils/fetchInstance";
import { getAuthorizedStatus } from "./utils/getAuthorizedStatus";

const theme = createTheme({
  palette: {
    primary: {
      main: MAIN_COLOR,
      dark: DARK_COLOR,
      contrastText: "#fff",
    },
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: "0px",
          paddingBottom: "0px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
  },
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesUrl },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Different",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getAuthorizedStatus(request);
  return user;
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

const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
  server: {
    nodes: [
      {
        host: "localhost",
        port: 8108,
        protocol: "http",
      },
    ],
    apiKey: "xyz",
  },
  additionalSearchParameters: {
    query_by: "title,designer",
  },
});

export default function App() {
  const user = useLoaderData();
  const [searchParams] = useSearchParams();

  return (
    <html
      lang="en"
      className={`overflow-y-scroll ${
        searchParams.get("login") && "scrollbar"
      }`}
    >
      <head>
        <Meta />
        <Links />
      </head>
      <body className="px-4">
        <ThemeProvider theme={theme}>
          <InstantSearch
            indexName="listings"
            searchClient={typesenseInstantsearchAdapter.searchClient}
          >
            <Header user={user} />
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
