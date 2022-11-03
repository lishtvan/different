import { MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import FieldTitle from "./FieldTitle";
import type { Section } from "~/constants/listing";
import { CATEGORIES, SIZES } from "~/constants/listing";
import { useActionData } from "@remix-run/react";

const SelectCategory = () => {
  const actionData = useActionData();

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
          error={Boolean(actionData?.errors?.category)}
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
                <div className="w-3/5" key={section}>
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
        {actionData?.errors?.category && (
          <p className="ml-2 mt-1 text-[#d32f2f]">
            {actionData.errors.category}
          </p>
        )}
      </div>
      <div>
        <FieldTitle title="Size" required={true} />
        <TextField
          select
          disabled={!selectedSection}
          name="size"
          value={size}
          error={Boolean(actionData?.errors?.size)}
          onChange={(e) => setSize(e.target.value)}
          SelectProps={{
            classes: {
              icon: "border-none",
            },
            sx: actionData?.errors?.size
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
        {actionData?.errors?.size && (
          <p className="ml-2 mt-1 text-[#d32f2f]">{actionData.errors.size}</p>
        )}
      </div>
    </div>
  );
};

export default SelectCategory;
