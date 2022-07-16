import { Button } from "@mui/material";

const Header = () => {
  return (
    <header className="bg-white py-5">
      <div className="flex justify-between items-center">
        <h1 className="flex-grow text-3xl font-black decoration-solid">
          Different
        </h1>
        <div>
          <Button variant="contained">SELL</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
