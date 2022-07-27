import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import type {
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
import Header from "./components/Header";
import Login from "./components/Login";
import tailwindStylesUrl from "./styles/tailwind.css";
import { fetchInstance } from "./utils/fetchInstance";
import { getAuthorizedStatus } from "./utils/getAuthorizedStatus";

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#11a683",
      dark: "#0f9575",
      contrastText: "#fff",
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

export const action = async ({ request }: { request: Request }) => {
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
  console.log(response.status);
  if (response.status !== 401) {
    const formData = await request.formData();
    const route = formData.get("route")?.toString();

    return redirect(route!);
  }
  return API_DOMAIN;
};

export default function App() {
  const user = useLoaderData();
  const [searchParams] = useSearchParams();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="container mx-auto px-4">
        <ThemeProvider theme={theme}>
          <Header user={user} />
          <Outlet />
          {searchParams.get("login") && <Login />}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
