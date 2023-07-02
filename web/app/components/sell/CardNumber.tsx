import { InputAdornment, TextField } from "@mui/material";
import FieldTitle from "./FieldTitle";
import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import { useActionData, useLoaderData } from "@remix-run/react";

// @ts-ignore
const cardNumberValidator = ({ cardType }) => {
  const { displayName } = cardType;
  if (displayName === "Visa" || displayName === "Mastercard") return;
  return "Card must be Visa or Mastercard";
};

const CardNumber = () => {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const { getCardNumberProps, getCardImageProps, meta } = usePaymentInputs({
    // @ts-ignore
    cardNumberValidator,
  });

  return (
    <div>
      <input type="hidden" name="cardNumberError" value={meta.error} />
      <FieldTitle title={"Номер картки"} required={true} />
      <TextField
        fullWidth
        type="tel"
        name="cardNumber"
        defaultValue={loaderData?.cardNumber}
        inputProps={{
          ...getCardNumberProps({}),
          placeholder: "Введіть номер картки",
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
          {actionData.errors.cardNumber}
        </p>
      )}
    </div>
  );
};

export default CardNumber;
