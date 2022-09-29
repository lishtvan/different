import { Clear, Search } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useLocation } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useSearchBox } from "react-instantsearch-hooks-web";

const MainSearch = () => {
  const { pathname } = useLocation();
  const { refine } = useSearchBox();
  const [seachValue, setSearchValue] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    refine(e.currentTarget.value);
    setSearchValue(e.currentTarget.value);
  };

  const clearSearch = () => {
    refine("");
    setSearchValue("");
  };

  if (pathname !== "/") return null;

  return (
    <TextField
      className="ml-4 w-[100%] sm:w-[48.5%]"
      placeholder="Search"
      inputProps={{ "aria-label": "search" }}
      onChange={onChange}
      value={seachValue}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {seachValue ? (
              <IconButton onClick={clearSearch}>
                <Clear />
              </IconButton>
            ) : (
              <IconButton>
                <Search />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default MainSearch;
