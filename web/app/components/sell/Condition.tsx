import { MenuItem, TextField } from "@mui/material";
import { useActionData } from "@remix-run/react";
import FieldTitle from "./FieldTitle";

const Condition = () => {
  const actionData = useActionData();
  return (
    <div>
      <FieldTitle title="Condition" required={true} />
      <TextField
        select
        error={Boolean(actionData?.errors?.condition)}
        name="condition"
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
      {actionData?.errors?.condition && (
        <p className="ml-2 mt-1 text-[#d32f2f]">
          {actionData.errors.condition}
        </p>
      )}
    </div>
  );
};

export default Condition;
