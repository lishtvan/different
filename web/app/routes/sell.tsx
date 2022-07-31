import type { SelectChangeEvent } from "@mui/material";
import { InputAdornment, OutlinedInput } from "@mui/material";
import { MenuItem, Select, TextField } from "@mui/material";
import { Form } from "@remix-run/react";
import { useCallback, useState } from "react";
import SelectCategory from "~/components/sell/SelectCategory";

const SellRoute = () => {
  const [condition, setCondition] = useState("");
  const [currency, setCurrency] = useState("₴");

  const handleChangeCondition = (event: SelectChangeEvent) => {
    setCondition(event.target.value);
  };

  const handleChangeCurrency = (event: SelectChangeEvent) => {
    setCurrency(event.target.value);
  };

  const [selectedCategory, setSelectedCategory] = useState("");

  const selectCategory = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="flex mt-6 mb-36 justify-center items-center flex-col">
      <div className=" text-3xl mb-6 font-semibold">Create a listing</div>
      <Form method="post" className="w-1/3">
        <div className="text-2xl mb-2 ml-2">Title</div>
        <TextField
          placeholder="Enter item title up to 80 characters"
          inputProps={{
            maxLength: 80,
          }}
          className="w-full"
        />
        <div className="mt-6 text-2xl mb-2 ml-2">Category</div>
        <SelectCategory
          selectCategory={selectCategory}
          selectedCategory={selectedCategory}
        />
        <div className="mt-6 text-2xl mb-2 ml-2">Description</div>
        <TextField
          rows={3}
          multiline
          inputProps={{
            maxLength: 1000,
          }}
          className="w-full"
          placeholder="Add more information about condition of item, how does it fit, measurements, expierence of wearing, materials, etc. (up to 1000 characters)"
        />
        <div className="mt-6 text-2xl mb-2 ml-2">Condition</div>
        <Select
          className="w-full"
          displayEmpty
          onChange={handleChangeCondition}
          value={condition}
          renderValue={
            condition !== ""
              ? undefined
              : () => <div className="text-[#aaa]">Be honest.</div>
          }
        >
          <MenuItem value={"New with tags"}>New with tags</MenuItem>
          <MenuItem value={"Several times worn"}>Several times worn</MenuItem>
          <MenuItem value={"Gently used"}>Gently used</MenuItem>
          <MenuItem value={"Used"}>Used</MenuItem>
          <MenuItem value={"Very worn"}>Very worn</MenuItem>
        </Select>
        <div className="mt-6 text-2xl mb-2 ml-2">Price</div>
        <OutlinedInput
          placeholder="Enter item price"
          className="w-full"
          startAdornment={
            <InputAdornment position="start">
              <Select
                className=" bg-white"
                value={currency}
                onChange={handleChangeCurrency}
                variant="standard"
                sx={{
                  "& .MuiInput-input:focus": {
                    backgroundColor: "white",
                  },
                }}
                disableUnderline
              >
                <MenuItem value={"$"}>$</MenuItem>
                <MenuItem value={"₴"}>₴</MenuItem>
              </Select>
            </InputAdornment>
          }
        />
      </Form>
    </div>
  );
};

export default SellRoute;
