import { Button, Dialog, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Link, useFetcher, useLocation, useNavigate } from "@remix-run/react";
import GoogleIcon from "./../../assets/google.svg";
import FacebookIcon from "./../../assets/facebook.svg";
import TwitterIcon from "./../../assets/twitter.svg";
import { useEffect, useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [checkAuth, setCheckAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.submit(
        { route: location.pathname },
        { method: "post", action: "/" }
      );
    }
  }, [fetcher, location.pathname]);

  // TODO: add counter
  useEffect(() => {
    if (!checkAuth) return;
    const interval = setInterval(() => {
      fetcher.submit(
        { route: location.pathname },
        { method: "post", action: "/" }
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [checkAuth, fetcher, location.pathname]);

  const onClose = () => {
    navigate(-1);
  };

  const redirect = (provider: string) => {
    const API_DOMAIN = fetcher.data;
    const width = 680;
    const height = 680;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const windowFeatures = `left=${left},top=${top},width=${width},height=${height}`;
    if (API_DOMAIN) {
      window.open(
        `${API_DOMAIN}/auth/${provider}`,
        "authorize",
        windowFeatures
      );
    }
    setCheckAuth(true);
  };

  return (
    <Dialog
      open={true}
      disableScrollLock={true}
      onClose={onClose}
      className="mx-auto flex items-center justify-center"
    >
      <DialogTitle sx={{ marginLeft: "auto" }}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <div className="flex w-[400px] flex-col items-center justify-start">
        <div className="text-3xl font-semibold">Увійти за допомогою:</div>
        <div className="mt-10 flex w-72 flex-col">
          <Button
            color="inherit"
            onClick={() => redirect("google")}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <img
              className="ml-4"
              width={44}
              height={44}
              src={GoogleIcon}
              alt="google"
            />
            <div className="w-1/2">Google</div>
          </Button>
          <Button
            color="inherit"
            onClick={() => redirect("twitter")}
            sx={{
              display: "flex",
              paddingTop: "10px",
              paddingBottom: "10px",
              marginTop: "10px",
              justifyContent: "center",
            }}
          >
            <img
              className="ml-4"
              width={44}
              height={44}
              src={TwitterIcon}
              alt="twitter"
            />
            <div className="w-1/2">Twitter</div>
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
            <img
              className="ml-4"
              width={44}
              height={44}
              src={FacebookIcon}
              alt="facebook"
            />
            <div className="w-1/2">Facebook</div>
          </Button>
        </div>
        <div className="my-6 flex w-3/4 justify-center text-center">
          <div>
            Створюючи аккаунт, ви погоджуєтесь з нашою{" "}
            <Link
              target="_blank"
              className="text-blue-500 underline underline-offset-[4px]"
              to="/info?q=privacy"
            >
              Політикою конфіденційності
            </Link>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Login;
