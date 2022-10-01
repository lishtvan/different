import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SortBy = () => {
  return (
    <div className="ml-auto">
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel id="demo-select-small">Sort by:</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          label="Sort by:"
        >
          <MenuItem value="">
            <em>Default</em>
          </MenuItem>
          <MenuItem value={20}>Price: Low first</MenuItem>
          <MenuItem value={30}>Price: High first</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SortBy;
