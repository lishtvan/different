import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
  Checkbox,
  Collapse,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
import { useRefinementList } from "react-instantsearch-hooks-web";

interface SubCategoryFilterProps {
  category: string;
  subcategories: Array<{
    label: string;
    count: number;
    value: string;
    isRefined: boolean;
  }>;
}

const SubCategoryFilter: FC<SubCategoryFilterProps> = ({
  category,
  subcategories,
}) => {
  const [open, setOpen] = useState(false);

  const { refine } = useRefinementList({
    attribute: "category",
  });

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className={`${subcategories.length === 0 ? "hidden" : "block"}`}>
      <ListItemButton onClick={handleClick} className="rounded-xl pl-8">
        <ListItemText primary={category} />
        {open ? (
          <ArrowDropUp className="mr-1.5" />
        ) : (
          <ArrowDropDown className="mr-1.5" />
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto" className="pl-4">
        <List>
          {subcategories.map((item) => (
            <ListItem key={item.label} className="px-1" disablePadding>
              <FormControlLabel
                className="m-0 w-full rounded-xl px-1 hover:bg-[#f2f2f5]"
                control={
                  <Checkbox
                    checked={item.isRefined}
                    onClick={() => refine(item.value)}
                  />
                }
                label={
                  <div className="flex items-center">
                    <div className="text-ellipsis whitespace-nowrap">
                      {item.label}
                    </div>
                    <div className="ml-3 rounded-full bg-[#ebebeb] px-2">
                      {item.count}
                    </div>
                  </div>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </div>
  );
};

export default SubCategoryFilter;
