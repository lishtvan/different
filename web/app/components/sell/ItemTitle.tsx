import { TextField } from "@mui/material";
import { useActionData, useLoaderData } from "@remix-run/react";
import FieldTitle from "./FieldTitle";

const ItemTitle = () => {
  const actionData = useActionData();
  const loaderData = useLoaderData();

  return (
    <div>
      <FieldTitle title={"Заголовок"} required={true} />
      <TextField
        name="title"
        defaultValue={loaderData?.title}
        error={Boolean(actionData?.errors?.title)}
        placeholder={"Введіть заголовок до 80 символів"}
        inputProps={{
          maxLength: 80,
        }}
        className="w-full"
      />
      {actionData?.errors?.title && (
        <p className="ml-2 mt-1 text-[#d32f2f]">{actionData.errors.title}</p>
      )}
    </div>
  );
};
export default ItemTitle;
