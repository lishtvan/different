import {
  Collapse,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useRange } from "react-instantsearch-hooks-web";

interface PriceRange {
  min?: number;
  max?: number;
}

const PriceFilter = () => {
  const [open, setOpen] = useState(false);
  const { range, refine } = useRange({
    attribute: "price",
  });

  const [priceRange, setPriceRange] = useState<PriceRange>();

  useEffect(() => {
    const { min, max } = range;
    setPriceRange({ min, max });
  }, [range.max, range.min]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={"Price"} />
        {open ? (
          <ExpandLess className="mr-1" />
        ) : (
          <ExpandMore className=" mr-1.5" />
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto">
        <List className="px-8" component="div" disablePadding>
          <div className="flex justify-around my-4">
            <FormControl className="w-1/2" variant="outlined">
              <InputLabel htmlFor="min-label">Min</InputLabel>
              <OutlinedInput
                type="number"
                label="Min"
                id="min-label"
                inputProps={{ min: priceRange?.min }}
                startAdornment={<div className="mr-2">₴</div>}
                onChange={(e) => {
                  setPriceRange({ ...priceRange, min: Number(e.target.value) });
                  refine([Number(e.target.value), priceRange?.max]);
                }}
                value={priceRange?.min?.toString()}
              />
            </FormControl>
            <FormControl className="w-1/2 ml-5" variant="outlined">
              <InputLabel htmlFor="max-label">Max</InputLabel>
              <OutlinedInput
                type="number"
                label="Max"
                id="max-label"
                inputProps={{ max: priceRange?.max }}
                startAdornment={<div className="mr-2">₴</div>}
                onChange={(e) => {
                  setPriceRange({
                    ...priceRange,
                    max: Number(e?.target?.value),
                  });
                  refine([priceRange?.min, Number(e.target.value)]);
                }}
                value={priceRange?.max?.toString()}
              />
            </FormControl>
          </div>
        </List>
      </Collapse>
    </>
  );
};

export default PriceFilter;
