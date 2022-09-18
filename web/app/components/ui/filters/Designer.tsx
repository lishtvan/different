import {
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useRefinementList } from "react-instantsearch-hooks-web";
import { Search, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";

const DesignerFilter = () => {
  const { refine, searchForItems, items } = useRefinementList({
    attribute: "designer",
  });
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ borderRadius: "0.75rem" }}>
        <ListItemText primary="Designer" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          <ListItem disablePadding className="pt-2 px-2 mb-2">
            <TextField
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              onChange={(event) => searchForItems(event.currentTarget.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>

          {items.map((item) => (
            <ListItem key={item.label} className="px-2" disablePadding>
              <FormControlLabel
                className="w-full p-0 m-0 hover:bg-[#f2f2f5] rounded-lg"
                control={<Checkbox onClick={(event) => refine(item.value)} />}
                label={
                  <div className="flex">
                    <div>{item.label}</div>
                    <div className="ml-4 px-2 bg-[#ebebeb] rounded-full">
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

export default DesignerFilter;
