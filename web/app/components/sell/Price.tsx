import { OutlinedInput } from "@mui/material";
import { useActionData, useLoaderData } from "@remix-run/react";
import FieldTitle from "./FieldTitle";

const Price = () => {
  const actionData = useActionData();
  const loaderData = useLoaderData();

  return (
    <div>
      <FieldTitle title={"Ціна"} required={true} />
      <OutlinedInput
        placeholder={"Введіть ціну в гривнях"}
        className="w-full"
        type="number"
        defaultValue={loaderData?.price}
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
