import { MenuItem, TextField } from "@mui/material";
import { useActionData } from "@remix-run/react";
import { CONDITIONS } from "~/constants/listing";
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
        {CONDITIONS.map((condition) => (
          <MenuItem key={condition} value={condition}>
            {condition}
          </MenuItem>
        ))}
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
