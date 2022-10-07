import type { TooltipProps } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import {
  Avatar,
  Button,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { Person, Edit, Logout } from "@mui/icons-material";
import { Form, Link, useNavigate, useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import { useState } from "react";
import ProfileImage from "./../../assets/profile.jpeg";
import logo from "./../../assets/logo.jpg";
import MainSearch from "../index/Search";

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

interface Props {
  user: {
    id: string;
    avatarKey: string;
  };
}

const Header: FC<Props> = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  const onMenuItemClick = (path: string) => {
    navigate(path);
    setShowTooltip(false);
  };

  return (
    <header className="bg-white py-1 sticky top-0 z-50">
      <div className="flex items-cente flex-col mb-5 sm:flex-row sm:mb-0">
        <Link
          to="/"
          className="flex items-center min-w-[320px] justify-center mb-5 sm:justify-start sm:mb-0"
        >
          <img src={logo} width={96} height={96} alt="logo" />
          <div className="text-3xl font-black decoration-solid">DIFFERENT</div>
        </Link>
        <div className="flex justify-between items-center w-full">
         
          <MainSearch />
          <div className="hidden items-center sm:flex ml-auto">
            <Link className="mr-5" to="/sell">
              <Button variant="contained">SELL</Button>
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
                        <Edit fontSize="large" />
                      </ListItemIcon>
                      <div className="font-normal text-xl">Edit</div>
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
                  <div className="rounded-full border-4 mr-3 border-white hover:border-main">
                    <Avatar
                      className="border-2 border-white"
                      src={user.avatarKey || ProfileImage}
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
