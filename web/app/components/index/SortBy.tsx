import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSortBy } from "react-instantsearch-hooks-web";

const SortByPrice = () => {
  const sort = useSortBy({
    items: [
      { label: "За замовчуванням", value: "listings" },
      { label: "Спочатку дешеві", value: "listings/sort/price:asc" },
      { label: "Спочатку дорогі", value: "listings/sort/price:desc" },
    ],
  });

  return (
    <div className="ml-auto">
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel id="demo-select-small">Сортувати</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          label={"Сортувати"}
          MenuProps={{
            disableScrollLock: true,
          }}
          value={
            sort.currentRefinement === "listings" ? "" : sort.currentRefinement
          }
          onChange={(e) => sort.refine(e.target.value as string)}
        >
          {sort.options?.map((sort) => (
            <MenuItem key={sort.value} value={sort.value}>
              sort.label
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SortByPrice;
