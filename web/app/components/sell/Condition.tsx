import { MenuItem, TextField } from "@mui/material";
import FieldTitle from "./FieldTitle";
import type { FC } from "react";

interface Props {
  error: string;
}

const Condition: FC<Props> = ({ error }) => (
  <>
    <FieldTitle title="Condition" required={true} />
    {error && <p className="ml-2 mb-1 text-[#d32f2f]">{error}</p>}
    <TextField
      select
      error={Boolean(error)}
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
  </>
);

export default Condition;
