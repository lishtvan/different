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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { refine } = useRefinementList({
    attribute: "category",
  });

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className={`${subcategories.length === 0 ? "hidden" : "block"}`}>
      <ListItemButton onClick={handleClick} className="pl-8 rounded-xl">
        <ListItemText primary={t(category)} />
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
                className="w-full px-1 m-0 hover:bg-[#f2f2f5] rounded-xl"
                control={
                  <Checkbox
                    checked={item.isRefined}
                    onClick={() => refine(item.value)}
                  />
                }
                label={
                  <div className="flex items-center">
                    <div className="whitespace-nowrap text-ellipsis">
                      {t(item.label)}
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
    </div>
  );
};

export default SubCategoryFilter;
