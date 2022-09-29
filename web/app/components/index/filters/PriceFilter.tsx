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
import type { ChangeEvent} from "react";
import {useState } from "react";
import { useRange } from "react-instantsearch-hooks-web";

interface PriceRange {
  min: number;
  max: number;
}

const PriceFilter = () => {
  const [open, setOpen] = useState(false);

  const { refine } = useRange({
    attribute: "price",
    min: 1,
    max: 99999,
  });

  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 1,
    max: 99999,
  });

  const onMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.currentTarget.value);
    setPriceRange({ min: priceRange.min, max: newMax });
    if (newMax > priceRange.min) refine([priceRange.min, newMax]);
  };

  const onMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.currentTarget.value);
    setPriceRange({ max: priceRange.max, min: newMin });
    if (newMin < priceRange.max) refine([newMin, priceRange.max]);
  };

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
                inputProps={{ min: 1 }}
                startAdornment={<div className="mr-2">₴</div>}
                onChange={onMinChange}
                value={priceRange?.min?.toString()}
              />
            </FormControl>
            <FormControl className="w-1/2 ml-5" variant="outlined">
              <InputLabel htmlFor="max-label">Max</InputLabel>
              <OutlinedInput
                type="number"
                label="Max"
                id="max-label"
                inputProps={{ max: 99999 }}
                startAdornment={<div className="mr-2">₴</div>}
                onChange={onMaxChange}
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
