import { TextField } from "@mui/material";
import FieldTitle from "./FieldTitle";
import type { FC } from "react";

interface Props {
  error: string;
}

const ItemTitle: FC<Props> = ({ error }) => (
  <>
    <FieldTitle title="Item title" required={true} />
    {error && <p className="ml-2 mb-1 text-[#d32f2f]">{error}</p>}
    <TextField
      name="title"
      error={Boolean(error)}
      placeholder="Enter item title up to 80 characters"
      inputProps={{
        maxLength: 80,
      }}
      className="w-full"
    />
  </>
);

export default ItemTitle;
