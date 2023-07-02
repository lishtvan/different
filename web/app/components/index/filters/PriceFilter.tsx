import {
  Collapse,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRange } from "react-instantsearch-hooks-web";

const PriceFilter = () => {
  const [open, setOpen] = useState(false);
  const { refine, start } = useRange({
    attribute: "price",
    min: 0,
    max: 99999,
  });

  useEffect(() => {
    const [min, max] = start;
    if (min === -Infinity || max === Infinity) refine([0, 99999]);
  }, [start]);

  const onMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.currentTarget.value);
    refine([start[0], newMax]);
  };

  const onMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.currentTarget.value);
    refine([newMin, start[1]]);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick} className="rounded-xl">
        <ListItemText primary={"Ціна"} />
        {open ? (
          <ArrowDropUp className="mr-1.5" />
        ) : (
          <ArrowDropDown className="mr-1.5" />
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto">
        <List className="px-8" component="div" disablePadding>
          <div className="my-2 flex justify-around">
            <FormControl className="w-1/2" variant="outlined">
              <InputLabel htmlFor="min-label">Min</InputLabel>
              <OutlinedInput
                type="number"
                label="Min"
                id="min-label"
                inputProps={{ min: 0 }}
                startAdornment={<div className="mr-2">₴</div>}
                onChange={onMinChange}
                value={start[0]?.toString()}
              />
            </FormControl>
            <FormControl className="ml-5 w-1/2" variant="outlined">
              <InputLabel htmlFor="max-label">Max</InputLabel>
              <OutlinedInput
                type="number"
                label="Max"
                id="max-label"
                inputProps={{ max: 99999, min: 0 }}
                startAdornment={<div className="mr-2">₴</div>}
                onChange={onMaxChange}
                value={start[1]?.toString()}
              />
            </FormControl>
          </div>
        </List>
      </Collapse>
    </>
  );
};

export default PriceFilter;
