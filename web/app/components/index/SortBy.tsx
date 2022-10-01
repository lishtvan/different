import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSortBy } from "react-instantsearch-hooks-web";

const SortByPrice = () => {
  const sort = useSortBy({
    items: [
      { label: "Default", value: "listings" },
      { label: "Price: Low first", value: "listings/sort/price:asc" },
      { label: "Price: High first", value: "listings/sort/price:desc" },
    ],
  });

  return (
    <div className="ml-auto">
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel id="demo-select-small">Sort by:</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          label="Sort by:"
          onChange={(e) => sort.refine(e.target.value as string)}
        >
          {sort.options?.map((sort) => (
            <MenuItem key={sort.value} value={sort.value}>
              {sort.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SortByPrice;
