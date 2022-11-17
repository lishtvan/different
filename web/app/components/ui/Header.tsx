import type { TooltipProps } from "@mui/material";
import { Avatar } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import {
  Button,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { Person, Logout, Settings } from "@mui/icons-material";
import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
import ProfileImage from "./../../assets/profile.jpeg";
import logo from "./../../assets/logo.jpg";
import logoText from "./../../assets/logoText.jpg";
import MainSearch from "../index/Search";
import { useTranslation } from "react-i18next";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    padding: 0,
    boxShadow: theme.shadows[1],
    margin: 0,
  },
}));

const Header = () => {
  const { user } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();
  let { t } = useTranslation();

  const onMenuItemClick = (path: string) => {
    navigate(path);
    setShowTooltip(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="flex items-cente flex-col mb-5 pt-2 sm:flex-row sm:mb-0">
        <Link
          to="/"
          className="flex items-center min-w-[320px] justify-center mb-5 sm:justify-start sm:mb-0"
        >
          <img src={logo} width={64} height={96} alt="logo" />
          <img src={logoText} width={220} alt="DIFFERENT" />
        </Link>
        <div className="flex justify-between items-center w-full">
          <MainSearch />
          <div className="hidden items-center sm:flex ml-auto">
            <Link className="mr-5" to="/sell">
              <Button variant="contained">{t("sell")}</Button>
            </Link>
            {user ? (
              <LightTooltip
                placement="bottom-start"
                open={showTooltip}
                onOpen={() => setShowTooltip(true)}
                onClose={() => setShowTooltip(false)}
                leaveDelay={200}
                id="tooltip-id"
                title={
                  <div>
                    <MenuItem
                      className="px-4"
                      onClick={() => onMenuItemClick(`/user/${user.id}`)}
                    >
                      <ListItemIcon className="mr-2">
                        <Person fontSize="large" />
                      </ListItemIcon>
                      <div className="font-normal text-xl">Profile</div>
                    </MenuItem>
                    <MenuItem
                      className="px-4"
                      onClick={() => onMenuItemClick("/user/edit")}
                    >
                      <ListItemIcon className="mr-2">
                        <Settings fontSize="large" />
                      </ListItemIcon>
                      <div className="font-normal text-xl">Settings</div>
                    </MenuItem>
                    <Form action="/logout" method="post">
                      <button
                        type="submit"
                        onClick={() => setShowTooltip(false)}
                        className="text-xl"
                      >
                        <MenuItem className="px-4">
                          <ListItemIcon className="mr-2">
                            <Logout fontSize="large" />
                          </ListItemIcon>
                          <div className="font-normal text-xl">Log out</div>
                        </MenuItem>
                      </button>
                    </Form>
                  </div>
                }
              >
                <Link to={`/user/${user.id}`}>
                  <div className="rounded-full border-4 border-white hover:border-main">
                    <Avatar
                      className="border-2 border-white"
                      src={user.avatarUrl || ProfileImage}
                      sx={{ width: 50, height: 50 }}
                    />
                  </div>
                </Link>
              </LightTooltip>
            ) : (
              <Button
                onClick={() =>
                  setSearchParams(`?${searchParams.toString()}&login=true`)
                }
                className="whitespace-nowrap"
                variant="contained"
              >
                SIGN IN
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
