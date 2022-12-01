import { MenuItem, TextField } from "@mui/material";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { CONDITIONS } from "~/constants/listing";
import FieldTitle from "./FieldTitle";

const Condition = () => {
  const { t } = useTranslation();
  const actionData = useActionData();
  const loaderData = useLoaderData();

  return (
    <div>
      <FieldTitle title={t("Condition")} required={true} />
      <TextField
        select
        defaultValue={loaderData?.condition}
        error={Boolean(actionData?.errors?.condition)}
        name="condition"
        SelectProps={{
          displayEmpty: true,
          MenuProps: { disableScrollLock: true },
          renderValue: (value) =>
            typeof value === "string" ? (
              <div>{t(value)}</div>
            ) : (
              <div className="text-[#aaa]">{t("Be honest")}</div>
            ),
        }}
        className="w-full"
      >
        {CONDITIONS.map((condition) => (
          <MenuItem key={condition} value={condition}>
            {t(condition)}
          </MenuItem>
        ))}
      </TextField>
      {actionData?.errors?.condition && (
        <p className="ml-2 mt-1 text-[#d32f2f]">
          {t(actionData.errors.condition)}
        </p>
      )}
    </div>
  );
};

export default Condition;
