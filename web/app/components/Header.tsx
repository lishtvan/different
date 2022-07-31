import type { TooltipProps } from "@mui/material";
import {
  Avatar,
  Button,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { Form, Link, useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import { useState } from "react";
import { S3_URL } from "~/constants/s3";
import ProfileImage from "./../assets/profile.jpeg";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
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

  return (
    <header className="bg-white py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex-grow text-3xl font-black decoration-solid">
          Different
        </Link>
        <Link className="mr-5" to="/sell">
          <Button variant="contained">SELL</Button>
        </Link>
        {user ? (
          <LightTooltip
            placement="bottom"
            open={showTooltip}
            onOpen={() => setShowTooltip(true)}
            onClose={() => setShowTooltip(false)}
            sx={{ marginTop: "-20px" }}
            title={
              <>
                <Link
                  to={`/user/${user.id}`}
                  onClick={() => setShowTooltip(false)}
                >
                  <MenuItem>
                    <div className="text-lg">Profile</div>
                  </MenuItem>
                </Link>
                <Link
                  to={`/user/edit`}
                  onClick={() => setShowTooltip(false)}
                  className="text-lg"
                >
                  <MenuItem>
                    <div className="text-lg">Edit</div>
                  </MenuItem>
                </Link>
                <Form action="/logout" method="post">
                  <button
                    type="submit"
                    onClick={() => setShowTooltip(false)}
                    className="text-lg"
                  >
                    <MenuItem>Log out</MenuItem>
                  </button>
                </Form>
              </>
            }
          >
            <Link to={`/user/${user.id}`} className="mt-1 ">
              <div className=" rounded-full border-4 border-white hover:border-[#11a683]">
                <Avatar
                  className="border-2 border-white"
                  src={
                    (user.avatarKey && `${S3_URL}/${user.avatarKey}`) ||
                    ProfileImage
                  }
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
