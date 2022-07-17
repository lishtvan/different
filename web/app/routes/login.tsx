import { Button } from "@mui/material";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchInstance } from "~/utils/fetchInstance";
import GoogleIcon from "./../assets/google.svg";
import AppleIcon from "./../assets/apple.svg";
import FacebookIcon from "./../assets/facebook.svg";

export const loader = async ({ request }: { request: Request }) => {
  const { API_DOMAIN } = process.env;
  const cookie = request.headers.get("Cookie");
  if (!cookie) return API_DOMAIN;
  const tokenRow = cookie.split("; ").find((row) => row.startsWith("token"));
  if (!tokenRow) return API_DOMAIN;
  const response = await fetchInstance({
    request,
    method: "GET",
    route: "/check/auth",
  });
  if (response.status !== 401) return redirect("/");
  return API_DOMAIN;
};

const LoginRoute = () => {
  const API_DOMAIN = useLoaderData();

  const redirect = (provider: string) => {
    window.location.href = `${API_DOMAIN}/auth/${provider}`;
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="mb-44 flex justify-center items-center flex-col">
        <div className="font-semibold text-3xl">Sign in with:</div>
        <div className="mt-10 flex flex-col w-72">
          <Button
            color="inherit"
            onClick={() => redirect("google")}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <img width={44} height={44} src={GoogleIcon} alt="google" />
            <div className="w-1/2">Google</div>
          </Button>
          <Button
            color="inherit"
            onClick={() => redirect("apple")}
            sx={{
              display: "flex",
              marginTop: "10px",
              justifyContent: "center",
            }}
          >
            <img width={44} height={44} src={AppleIcon} alt="apple" />
            <div className="w-1/2">Apple</div>
          </Button>
          <Button
            onClick={() => redirect("facebook")}
            color="inherit"
            sx={{
              display: "flex",
              marginTop: "10px",
              justifyContent: "center",
            }}
          >
            <img width={44} height={44} src={FacebookIcon} alt="facebook" />
            <div className="w-1/2">Facebook</div>
          </Button>
        </div>
      </div>

      {/* <div>
        <a href={`${API_DOMAIN}/auth/google`}>Sign in with google</a>
      </div> */}
    </div>
  );
};

export default LoginRoute;
