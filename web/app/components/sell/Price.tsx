import { OutlinedInput } from "@mui/material";
import FieldTitle from "./FieldTitle";
import type { FC } from "react";

interface Props {
  error: string;
}

const Price: FC<Props> = ({ error }) => {
  return (
    <div className="mt-6">
      <FieldTitle title="Price" required={true} />
      <OutlinedInput
        placeholder="Enter price in UAH"
        className="w-full"
        type="number"
        error={Boolean(error)}
        name="price"
        startAdornment={<div className="mr-2">₴</div>}
      />
      {error && <p className="ml-2 mt-1 text-[#d32f2f]">{error}</p>}
    </div>
  );
};

export default Price;
