import { MenuItem, Select } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
import type { Section } from "~/constants/categories";
import { CATEGORIES } from "~/constants/categories";

interface Props {
  selectCategory: (category: string) => void;
  selectedCategory: string;
}

const SelectCategory: FC<Props> = ({ selectCategory, selectedCategory }) => {
  const [currentSection, setCurrentSection] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const hanldeCategoryClick = (category: string) => {
    selectCategory(category);
    handleClose();
  };

  return (
    <Select
      className="w-full"
      displayEmpty
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      variant="outlined"
      MenuProps={{
        MenuListProps: {
          sx: {
            display: "flex",
          },
        },
      }}
      renderValue={
        selectedCategory !== ""
          ? () => <div>{selectedCategory}</div>
          : () => <div className="text-[#aaa]">Choose item category</div>
      }
    >
      <div className="w-2/5">
        {Object.keys(CATEGORIES).map((section, key) => (
          <MenuItem key={key} onMouseOver={() => setCurrentSection(section)}>
            {section}
          </MenuItem>
        ))}
      </div>
      {Object.keys(CATEGORIES).map((section, key) => {
        if (currentSection === section) {
          return (
            <div className="w-3/5">
              {CATEGORIES[section as Section].map((category, index) => (
                <MenuItem
                  key={index}
                  onClick={() => hanldeCategoryClick(category)}
                >
                  {category}
                </MenuItem>
              ))}
            </div>
          );
        } else return null;
      })}
    </Select>
  );
};

export default SelectCategory;
