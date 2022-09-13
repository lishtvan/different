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
import ProfileImage from "./../assets/profile.jpeg";
import { SearchBox } from "react-instantsearch-dom";

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
    <header className="bg-white py-3 sticky top-0 z-50">
      <div className="flex  items-center">
        <Link to="/" className="text-3xl font-black decoration-solid">
          DIFFERENT
        </Link>
        <SearchBox />
        <Link className="mr-5 ml-auto" to="/sell">
          <Button variant="contained">SELL</Button>
        </Link>
        {user ? (
          <LightTooltip
            placement="bottom"
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
              <div className="rounded-full border-4 border-white hover:border-main">
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
    </header>
  );
};

export default Header;
