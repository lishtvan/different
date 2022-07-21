import { Avatar, Button } from "@mui/material";
import { Link, useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import ProfileImage from "./../assets/profile.jpeg";

interface Props {
  isAuthorized: boolean;
  userId: string;
}

const Header: FC<Props> = ({ isAuthorized, userId }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <header className="bg-white py-5">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="flex-grow text-3xl font-black decoration-solid"
        >
          Different
        </Link>
        <Link className="mr-5" to="/sell">
          <Button variant="contained">SELL</Button>
        </Link>
        {isAuthorized ? (
          <Link to={`/user/${userId}`} className="mt-1">
            <Avatar
              src={ProfileImage}
              className="border-2 hover:border-[#11a683]"
            />
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
