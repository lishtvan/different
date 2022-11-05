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
import { Search, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { useState } from "react";

interface Props {
  enableSearch: boolean;
  attribute: string;
}

const CheckboxFilter: FC<Props> = ({ enableSearch, attribute }) => {
  const { refine, searchForItems, items, toggleShowMore, isShowingMore } =
    useRefinementList({
      attribute,
      limit: 15,
      showMore: true,
      showMoreLimit: 522,
    });
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const sentinelRef = useRef(null);

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isShowingMore) {
            toggleShowMore();
          }
        });
      });

      observer.observe(sentinelRef.current);

      return () => observer.disconnect();
    }
  }, [isShowingMore]);

  if (attribute === "tags" && items.length === 0) {
    return null;
  }

  return (
    <>
      <ListItemButton onClick={handleClick} className="rounded-xl">
        <ListItemText className="capitalize" primary={attribute} />
        {open ? (
          <ArrowDropUp className="mr-1.5" />
        ) : (
          <ArrowDropDown className="mr-1.5" />
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto">
        <List
          component="div"
          disablePadding
          className="max-h-96 overflow-y-scroll scrollbar-white"
        >
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
                    <div className="break-words">{item.label}</div>
                    <div className="ml-3 px-2 bg-[#ebebeb] rounded-full">
                      {item.count}
                    </div>
                  </div>
                }
              />
            </ListItem>
          ))}
          <div ref={sentinelRef} />
        </List>
      </Collapse>
    </>
  );
};

export default CheckboxFilter;
