import { Button } from "@mui/material";
import { Link } from "@remix-run/react";
import type { FC } from "react";

interface Props {
  isAuthorized: boolean;
}

const Header: FC<Props> = ({ isAuthorized }) => {
  return (
    <header className="bg-white py-5">
      <div className="flex justify-between items-center">
        <h1 className="flex-grow text-3xl font-black decoration-solid">
          Different
        </h1>
        {isAuthorized ? (
          <Link className="mr-2" to='/sell'>
            <Button variant="contained">SELL</Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button variant="contained">SIGN IN</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
