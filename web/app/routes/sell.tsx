import { Tooltip } from "@mui/material";
import { Button } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { InputAdornment, OutlinedInput } from "@mui/material";
import { MenuItem, TextField } from "@mui/material";
import type { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import type { FC } from "react";
import { useState } from "react";
import SelectCategory from "~/components/sell/SelectCategory";
import { DESIGNERS } from "~/constants/designers";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  console.log(Object.fromEntries(form));
  return null;
};

const FieldTitle: FC<{ title: string; required: boolean }> = ({
  title,
  required,
}) => (
  <div className="text-2xl mb-2 ml-2 flex">
    {required ? (
      <Tooltip
        title="Field is required"
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -5],
              },
            },
          ],
        }}
      >
        <div>{title} *</div>
      </Tooltip>
    ) : (
      <div>{title}</div>
    )}
  </div>
);

const SellRoute = () => {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="flex mt-6 mb-36 justify-center items-center flex-col">
      <div className="text-3xl mb-6 font-semibold">Create a new listing</div>
      <Form method="post" className="w-1/3">
        <FieldTitle title="Item title" required={true} />
        <TextField
          name="title"
          placeholder="Enter item title up to 80 characters"
          inputProps={{
            maxLength: 80,
          }}
          className="w-full"
        />
        <div className="mt-6">
          <FieldTitle title="Category" required={true} />
        </div>
        <SelectCategory />
        <div className="mt-6">
          <FieldTitle title="Designer" required={true} />
        </div>
        <Autocomplete
          className="w-full"
          options={DESIGNERS}
          noOptionsText="No such designer found"
          renderInput={(params) => (
            <TextField {...params} placeholder="Select designer" />
          )}
        />
        <div className="mt-6">
          <FieldTitle title="Description" required={false} />
        </div>
        <TextField
          rows={3}
          multiline
          inputProps={{
            maxLength: 1000,
          }}
          className="w-full"
          placeholder="Add more information about condition of item, how does it fit, measurements, expierence of wearing, materials, etc. (up to 1000 characters)"
        />
        <div className="mt-6">
          <FieldTitle title="Condition" required={true} />
        </div>
        <TextField
          select
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) =>
              typeof value === "string" ? (
                <div>{value}</div>
              ) : (
                <div className="text-[#aaa]">Be honest.</div>
              ),
          }}
          className="w-full"
        >
          <MenuItem value={"New with tags"}>New with tags</MenuItem>
          <MenuItem value={"Several times worn"}>Several times worn</MenuItem>
          <MenuItem value={"Gently used"}>Gently used</MenuItem>
          <MenuItem value={"Used"}>Used</MenuItem>
          <MenuItem value={"Very worn"}>Very worn</MenuItem>
        </TextField>
        <div className="mt-6">
          <FieldTitle title="Tags" required={false} />
        </div>
        <Autocomplete
          className="w-full"
          multiple
          options={tags.length === 3 ? [] : ["#vintage", "#nature", "#music"]}
          freeSolo={tags.length < 3}
          disableCloseOnSelect
          blurOnSelect={tags.length === 2}
          value={tags}
          noOptionsText="You can set maximum 3 tags"
          onChange={(e, newVal) => {
            const newTags = [...newVal];
            if (newTags.length) {
              const lastTag = newTags[newTags.length - 1];
              if (!lastTag.startsWith("#")) {
                newTags.pop();
                newTags.push(`#${lastTag}`);
              }
            }
            setTags(newTags);
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              disabled={tags.length === 3}
              placeholder={
                tags.length ? "" : "Make the search of your item easier."
              }
            />
          )}
        />
        <div className="mt-6">
          <FieldTitle title="Price" required={true} />
        </div>
        <OutlinedInput
          placeholder="Enter item price"
          className="w-full"
          startAdornment={
            <InputAdornment position="start">
              <TextField
                className="bg-white border-0"
                select
                defaultValue={"$"}
                variant="standard"
                sx={{
                  "& .MuiInput-input:focus": {
                    backgroundColor: "white",
                  },
                }}
              >
                <MenuItem className="bg-white hover:bg-[#f8f4f4]" value={"$"}>
                  $
                </MenuItem>
                <MenuItem className="bg-white hover:bg-[#f8f4f4]" value={"₴"}>
                  ₴
                </MenuItem>
              </TextField>
            </InputAdornment>
          }
        />
        <Button variant="contained" className="mt-6 mx-auto" type="submit">
          Sumbit
        </Button>
      </Form>
    </div>
  );
};

export default SellRoute;
