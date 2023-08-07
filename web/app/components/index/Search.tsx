import { Clear, Search } from "@mui/icons-material";
import { debounce, IconButton, InputAdornment, TextField } from "@mui/material";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useSearchBox } from "react-instantsearch-hooks-web";

const MainSearch = () => {
  const { refine } = useSearchBox();
  const [seachValue, setSearchValue] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debounce(refine, 150)(e.target.value);
  };

  const clearSearch = () => {
    refine("");
    setSearchValue("");
  };

  return (
    <TextField
      size="small"
      className="ml-4 mr-2 w-[100%] sm:w-[48.5%]"
      placeholder={"Пошук"}
      autoComplete="off"
      inputProps={{ "aria-label": "search" }}
      onChange={onChange}
      value={seachValue}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {seachValue ? (
              <IconButton size="small" onClick={clearSearch}>
                <Clear />
              </IconButton>
            ) : (
              <IconButton size="small">
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
