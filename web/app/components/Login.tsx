import { Button, Dialog, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFetcher, useNavigate } from "@remix-run/react";
import GoogleIcon from "./../assets/google.svg";
import AppleIcon from "./../assets/apple.svg";
import FacebookIcon from "./../assets/facebook.svg";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.submit({}, { method: "post", action: "/" });
    }
  }, [fetcher]);

  const redirect = (provider: string) => {
    const API_DOMAIN = fetcher.data;
    if (API_DOMAIN) window.location.href = `${API_DOMAIN}/auth/${provider}`;
  };

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="flex justify-center items-center"
    >
      <DialogTitle sx={{ marginLeft: "auto" }}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <div className="w-96 h-80 flex justify-start items-center flex-col">
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
    </Dialog>
  );
};

export default Login;
