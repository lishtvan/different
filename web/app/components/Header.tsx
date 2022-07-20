import { Avatar, Button } from "@mui/material";
import { Link, useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import ProfileImage from "./../assets/profile.png";

interface Props {
  isAuthorized: boolean;
}

const Header: FC<Props> = ({ isAuthorized }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <header className="bg-white py-5">
      <div className="flex justify-between items-center">
        <Link
          to="/home"
          className="flex-grow text-3xl font-black decoration-solid"
        >
          Different
        </Link>
        <Link className="mr-5" to="/sell">
          <Button variant="contained">SELL</Button>
        </Link>
        {isAuthorized ? (
          <Link to="/profile" className="mt-1">
            <Avatar src={ProfileImage} />
          </Link>
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
