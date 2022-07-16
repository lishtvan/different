import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = () => {
  return (
    <Autocomplete
      freeSolo
      sx={{ width: 300 }}
      options={["Cristóbal Balenciaga", "Yves Saint Laurent", "Christian Dior"]}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search for designer"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <IconButton sx={{ paddingRight: 0 }}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default Search;
