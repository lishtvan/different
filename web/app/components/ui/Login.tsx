import { Button, Dialog, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Link, useFetcher, useLocation, useNavigate } from "@remix-run/react";
import GoogleIcon from "./../../assets/google.svg";
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
      <DialogTitle className="flex w-full items-center justify-between">
        <div className="font-bold">Увійти за допомогою</div>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <div className="flex w-[400px] flex-col items-center justify-start py-8">
        <div className="flex w-80 flex-col">
          <Button
            color="inherit"
            onClick={() => redirect("google")}
            className="flex justify-center gap-x-4"
          >
            <img
              className="ml-4"
              width={44}
              height={44}
              src={GoogleIcon}
              alt="google"
            />
            <div className="ml-2 mr-4">Google</div>
          </Button>
        </div>
        <div className="my-6 flex justify-center text-center">
          <div>
            Створюючи аккаунт, ви погоджуєтесь з <br />
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
