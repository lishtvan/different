import { MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import FieldTitle from "./FieldTitle";

import type { FC } from "react";
import type { Section } from "~/constants/listing";
import { CATEGORIES, SIZES } from "~/constants/listing";

interface Props {
  sizeError: string;
  categoryError: string;
}

const SelectCategory: FC<Props> = ({ sizeError, categoryError }) => {
  const [currentSection, setCurrentSection] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [sizePlaceholder, setSizePlaceholder] = useState(false);
  const [size, setSize] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const hanldeCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSizePlaceholder(true);
    setSize("");
    Object.keys(CATEGORIES).forEach((section) => {
      CATEGORIES[section as Section].forEach((item) => {
        if (item === category) setSelectedSection(section);
      });
    });
    handleClose();
  };

  return (
    <div className="col-start-1 col-end-3 grid grid-cols-2 gap-8">
      <div>
        <FieldTitle title="Category" required={true} />
        <Select
          className="w-full"
          displayEmpty
          name="category"
          value={selectedCategory}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          variant="outlined"
          error={Boolean(categoryError)}
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
              : () => <div className="text-[#aaa]">Choose category</div>
          }
        >
          <div className="w-2/5">
            {Object.keys(CATEGORIES).map((section, index) => (
              <MenuItem
                key={index}
                onMouseOver={() => setCurrentSection(section)}
              >
                {section}
              </MenuItem>
            ))}
          </div>
          {Object.keys(CATEGORIES).map((section) => {
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
        {categoryError && (
          <p className="ml-2 mt-1 text-[#d32f2f]">{categoryError}</p>
        )}
      </div>
      <div>
        <FieldTitle title="Size" required={true} />
        <TextField
          select
          disabled={!selectedSection}
          name="size"
          value={size}
          error={Boolean(sizeError)}
          onChange={(e) => setSize(e.target.value)}
          SelectProps={{
            classes: {
              icon: "border-none",
            },
            sx: sizeError
              ? {
                  "& .Mui-disabled": {
                    border: "1px solid red",
                  },
                }
              : {},
            displayEmpty: true,
            renderValue: (value) =>
              value !== "" ? (
                <div>{value as string}</div>
              ) : (
                <div className="text-[#aaa]">
                  {sizePlaceholder
                    ? "Select size"
                    : "Please select category first"}
                </div>
              ),
          }}
          className="w-full"
        >
          {selectedCategory !== "" ? (
            SIZES[selectedSection as Section].map((size, index) => (
              <MenuItem key={index} value={size}>
                {size}
              </MenuItem>
            ))
          ) : (
            <div></div>
          )}
        </TextField>
        {sizeError && <p className="ml-2 mt-1 text-[#d32f2f]">{sizeError}</p>}
      </div>
    </div>
  );
};

export default SelectCategory;
