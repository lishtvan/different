import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import type { Section } from "~/constants/categories";
import { CATEGORIES } from "~/constants/categories";

const SelectCategory = () => {
  const [currentSection, setCurrentSection] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const hanldeCategoryClick = (category: string) => {
    setSelectedCategory(category);
    handleClose();
  };

  return (
    <Select
      className="w-full"
      displayEmpty
      name="category"
      value={selectedCategory}
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
