import { TextField } from "@mui/material";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import FieldTitle from "./FieldTitle";

const ItemTitle = () => {
  const actionData = useActionData();
  const { t } = useTranslation();
  const loaderData = useLoaderData();

  return (
    <div>
      <FieldTitle title={t("Title")} required={true} />
      <TextField
        name="title"
        defaultValue={loaderData?.title}
        error={Boolean(actionData?.errors?.title)}
        placeholder={t("Enter title up to 80 characters")!}
        inputProps={{
          maxLength: 80,
        }}
        className="w-full"
      />
      {actionData?.errors?.title && (
        <p className="ml-2 mt-1 text-[#d32f2f]">{t(actionData.errors.title)}</p>
      )}
    </div>
  );
};
export default ItemTitle;
