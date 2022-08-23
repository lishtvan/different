import { TextField } from "@mui/material";
import FieldTitle from "./FieldTitle";
import type { FC } from "react";

interface Props {
  error: string;
}

const ItemTitle: FC<Props> = ({ error }) => (
  <div>
    <FieldTitle title="Title" required={true} />
    <TextField
      name="title"
      error={Boolean(error)}
      placeholder="Enter title up to 80 characters"
      inputProps={{
        maxLength: 80,
      }}
      className="w-full"
    />
    {error && <p className="ml-2 mt-1 text-[#d32f2f]">{error}</p>}
  </div>
);

export default ItemTitle;
