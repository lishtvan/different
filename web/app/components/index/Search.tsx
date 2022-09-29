import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useLocation } from "@remix-run/react";
import { useSearchBox } from "react-instantsearch-hooks-web";

const MainSearch = () => {
  const { pathname } = useLocation();
  const { refine } = useSearchBox();

  if (pathname !== "/") return null;

  return (
    <TextField
      className="ml-4 w-[100%] sm:w-[48.5%]"
      placeholder="Search"
      inputProps={{ "aria-label": "search" }}
      onChange={(e) => refine(e.currentTarget.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default MainSearch;
