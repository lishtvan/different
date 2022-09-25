import {
  Checkbox,
  Collapse,
  FormControlLabel,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useRefinementList } from "react-instantsearch-hooks-web";
import { Search, ExpandLess, ExpandMore } from "@mui/icons-material";
import type { FC } from "react";
import { useState } from "react";

interface Props {
  enableSearch: boolean;
  attribute: string;
}

const CheckboxFilter: FC<Props> = ({ enableSearch, attribute }) => {
  const { refine, searchForItems, items } = useRefinementList({
    attribute,
  });
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemText className="capitalize" primary={attribute} />
        {open ? (
          <ExpandLess className="mr-1" />
        ) : (
          <ExpandMore className=" mr-1.5" />
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          {enableSearch && (
            <ListItem disablePadding className="mt-2 px-1 mb-2">
              <TextField
                placeholder="Search"
                className="w-full px-2"
                inputProps={{ "aria-label": "search" }}
                onChange={(event) => searchForItems(event.currentTarget.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </ListItem>
          )}

          {items.map((item) => (
            <ListItem key={item.label} className="px-1" disablePadding>
              <FormControlLabel
                className="w-full px-1 m-0 hover:bg-[#f2f2f5] rounded-xl"
                control={
                  <Checkbox
                    checked={item.isRefined}
                    onClick={() => {
                      refine(item.value);
                    }}
                  />
                }
                label={
                  <div className="flex items-center">
                    <div className="whitespace-nowrap text-ellipsis">
                      {item.label}
                    </div>
                    <div className="ml-3 px-2 bg-[#ebebeb] rounded-full">
                      {item.count}
                    </div>
                  </div>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default CheckboxFilter;
