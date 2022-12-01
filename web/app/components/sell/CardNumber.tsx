import { InputAdornment, TextField } from "@mui/material";
import FieldTitle from "./FieldTitle";
import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";

const CardNumber = () => {
  const { t } = useTranslation();
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const { getCardNumberProps, getCardImageProps, meta } = usePaymentInputs();

  return (
    <div>
      <FieldTitle title={t("Card number")} required={true} />
      <TextField
        fullWidth
        type="tel"
        name="cardNumber"
        defaultValue={loaderData?.cardNumber}
        inputProps={{
          ...getCardNumberProps({}),
          placeholder: t("Enter card number")!,
        }}
        error={
          (meta.isTouched && Boolean(meta.error)) ||
          Boolean(actionData?.errors?.cardNumber)
        }
        label={(meta.isTouched && meta.error) || undefined}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {/* @ts-ignore */}
              <svg {...getCardImageProps({ images })} />
            </InputAdornment>
          ),
        }}
      />
      {actionData?.errors?.cardNumber && (
        <p className="ml-2 mt-1 text-[#d32f2f]">
          {t(actionData.errors.cardNumber)}
        </p>
      )}
    </div>
  );
};

export default CardNumber;
