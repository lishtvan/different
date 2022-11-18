import { MenuItem, TextField } from "@mui/material";
import { useActionData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { CONDITIONS } from "~/constants/listing";
import FieldTitle from "./FieldTitle";

const Condition = () => {
  const actionData = useActionData();
  const { t } = useTranslation();

  return (
    <div>
      <FieldTitle title={t("Condition")} required={true} />
      <TextField
        select
        error={Boolean(actionData?.errors?.condition)}
        name="condition"
        SelectProps={{
          displayEmpty: true,
          MenuProps: { disableScrollLock: true },
          renderValue: (value) =>
            typeof value === "string" ? (
              <div>{value}</div>
            ) : (
              <div className="text-[#aaa]">{t("Be honest")}</div>
            ),
        }}
        className="w-full"
      >
        {CONDITIONS.map((condition) => (
          <MenuItem key={condition} value={condition}>
            {condition}
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
