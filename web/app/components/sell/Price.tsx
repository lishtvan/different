import { OutlinedInput } from "@mui/material";
import { useActionData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import FieldTitle from "./FieldTitle";

const Price = () => {
  const actionData = useActionData();
  const { t } = useTranslation();

  return (
    <div>
      <FieldTitle title={t("Price")} required={true} />
      <OutlinedInput
        placeholder={t("Enter price in UAH")!}
        className="w-full"
        type="number"
        error={Boolean(actionData?.errors?.price)}
        name="price"
        startAdornment={<div className="mr-2">₴</div>}
      />
      {actionData?.errors?.price && (
        <p className="ml-2 mt-1 text-[#d32f2f]">{t(actionData?.errors?.price)}</p>
      )}
    </div>
  );
};

export default Price;
