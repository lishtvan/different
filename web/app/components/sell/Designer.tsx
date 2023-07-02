import { Autocomplete, TextField } from "@mui/material";
import { DESIGNERS } from "~/constants/listing";
import FieldTitle from "./FieldTitle";
import { useActionData, useLoaderData } from "@remix-run/react";

const Designer = () => {
  const actionData = useActionData();
  const loaderData = useLoaderData();

  return (
    <div>
      <FieldTitle title={"Дизайнер"} required={true} />
      <Autocomplete
        className="w-full"
        defaultValue={loaderData.designer}
        options={DESIGNERS}
        noOptionsText={
          "Якщо Ви не знайшли потрібного дизайнера для своєї речі, оберіть Unknown і впишіть назву в заголовок. Ми переглядаємо такі оголошення і додаємо нових дизайнерів якнайшвидше. Ви також можете обрати Vintage або Custom якщо це ваш випадок."
        }
        renderInput={(params) => (
          <TextField
            {...params}
            error={Boolean(actionData?.errors?.designer)}
            name="designer"
            placeholder={"Оберіть дизайнера"}
          />
        )}
      />
      {actionData?.errors?.designer && (
        <p className="ml-2 mt-1 text-[#d32f2f]">{actionData.errors.designer}</p>
      )}
    </div>
  );
};

export default Designer;
