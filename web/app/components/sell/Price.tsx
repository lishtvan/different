import { OutlinedInput } from "@mui/material";
import { useActionData } from "@remix-run/react";
import FieldTitle from "./FieldTitle";

const Price = () => {
  const actionData = useActionData();

  return (
    <div className="mt-6">
      <FieldTitle title="Price" required={true} />
      <OutlinedInput
        placeholder="Enter price in UAH"
        className="w-full"
        type="number"
        error={Boolean(actionData?.errors?.price)}
        name="price"
        startAdornment={<div className="mr-2">₴</div>}
      />
      {actionData?.errors?.price && (
        <p className="ml-2 mt-1 text-[#d32f2f]">{actionData?.errors?.price}</p>
      )}
    </div>
  );
};

export default Price;
