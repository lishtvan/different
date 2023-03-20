import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSortBy } from "react-instantsearch-hooks-web";

const SortByPrice = () => {
  const sort = useSortBy({
    items: [
      { label: "Default", value: "listings" },
      { label: "Price: Low first", value: "listings/sort/price:asc" },
      { label: "Price: High first", value: "listings/sort/price:desc" },
    ],
  });
  const { t } = useTranslation();

  return (
    <div className="ml-auto">
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel id="demo-select-small">{t("Sort by")}</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          label={t("Sort by")}
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
              {t(sort.label)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SortByPrice;
