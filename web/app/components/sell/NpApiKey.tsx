import { TextField } from "@mui/material";
import { useActionData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import FieldTitle from "./FieldTitle";

const NpApiKey = () => {
  const actionData = useActionData();
  const { t } = useTranslation();

  return (
    <div className="col-start-1 col-end-3">
      <div className="flex items-center gap-x-6">
        <FieldTitle title={t("NovaPoshta API Key")} required={true} />
        <div className="mb-1.5">
          <a
            className="text-blue-500 underline underline-offset-[5px]"
            target="_blank"
            rel="noreferrer"
            href="https://different-marketplace.notion.site/API-c1a0dae6eed34a97a5057888de4c5e8f"
          >
            Detailed instruction and why do you need this.
          </a>
        </div>
      </div>
      <TextField
        name="npApiKey"
        error={Boolean(actionData?.errors?.npApiKey)}
        placeholder={t("Enter your NovaPoshta API key")!}
        className="w-full"
      />

      {actionData?.errors?.npApiKey && (
        <p className="ml-2 mt-1 text-[#d32f2f]">
          {t(actionData.errors.npApiKey)}
        </p>
      )}
      <div className="ml-2 mt-2">
        {t("In order to get the NovaPoshta API key, follow the link")}{" "}
        <a
          className="text-blue-500 underline underline-offset-[5px]"
          target="_blank"
          rel="noreferrer"
          href="https://new.novaposhta.ua"
        >
          https://new.novaposhta.ua
        </a>
        ,{" "}
        {t(
          "click Login as a private person, after login go to Settings => Security, copy the API key with the Mobile App service."
        )}
      </div>
    </div>
  );
};
export default NpApiKey;
