import { Autocomplete, TextField } from "@mui/material";
import { DESIGNERS } from "~/constants/listing";
import FieldTitle from "./FieldTitle";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";

const Designer = () => {
  const { t } = useTranslation();
  const actionData = useActionData();
  const loaderData = useLoaderData();

  return (
    <div>
      <FieldTitle title={t("Designer")} required={true} />
      <Autocomplete
        className="w-full"
        defaultValue={loaderData.designer}
        options={DESIGNERS}
        noOptionsText={t(
          "If you haven't found a designer for your item, select Unknown and put your designer's name in the title, we review listings with this mark and add new designers as soon as possible. You can also select Vintage or Custom if thats your case."
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            error={Boolean(actionData?.errors?.designer)}
            name="designer"
            placeholder={t("Select designer")!}
          />
        )}
      />
      {actionData?.errors?.designer && (
        <p className="ml-2 mt-1 text-[#d32f2f]">
          {t(actionData.errors.designer)}
        </p>
      )}
    </div>
  );
};

export default Designer;
