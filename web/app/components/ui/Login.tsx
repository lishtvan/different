import { Button, Dialog, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Link, useFetcher, useLocation, useNavigate } from "@remix-run/react";
import GoogleIcon from "./../../assets/google.svg";
import FacebookIcon from "./../../assets/facebook.svg";
import TwitterIcon from "./../../assets/twitter.svg";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      onClose={onClose}
      className="mx-auto flex items-center justify-center"
    >
      <DialogTitle sx={{ marginLeft: "auto" }}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <div className="flex w-[400px] flex-col items-center justify-start">
        <div className="text-3xl font-semibold">{t("Sign in with")}:</div>
        <div className="mt-10 flex w-72 flex-col">
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
            onClick={() => redirect("twitter")}
            sx={{
              display: "flex",
              paddingTop: "10px",
              paddingBottom: "10px",
              marginTop: "10px",
              justifyContent: "center",
            }}
          >
            <img width={44} height={44} src={TwitterIcon} alt="twitter" />
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
            <img width={44} height={44} src={FacebookIcon} alt="facebook" />
            <div className="w-1/2">Facebook</div>
          </Button>
        </div>
        <div className="my-6 flex w-3/4 flex-col items-center">
          <div>{t("By creating an account, I accept")} </div>
          <div>
            <Link
              target="_blank"
              className="text-blue-500 underline underline-offset-[4px]"
              to="/info?q=terms"
            >
              {t("Terms of Service")}
            </Link>
            {", "}
            <Link
              target="_blank"
              className="text-blue-500 underline underline-offset-[4px]"
              to="/info?q=privacy"
            >
              {t("Privacy policy")}
            </Link>
            {", "}
          </div>

          <Link
            target="_blank"
            className="text-blue-500 underline underline-offset-[4px]"
            to="/info?q=payment"
          >
            {t("Payment and Delivery")}
          </Link>
        </div>
      </div>
    </Dialog>
  );
};

export default Login;
