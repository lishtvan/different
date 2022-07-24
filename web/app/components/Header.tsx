import { Avatar, Button } from "@mui/material";
import { Link, useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import { S3_URL } from "~/constants/s3";
import ProfileImage from "./../assets/profile.jpeg";

interface Props {
  user: {
    id: string;
    avatarKey: string;
  };
}

const Header: FC<Props> = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();

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
          <Link to={`/user/${user.id}`} className="mt-1">
            <Avatar
              src={(user.avatarKey && `${S3_URL}/${user.avatarKey}`) || ProfileImage}
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
