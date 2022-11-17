import { InputAdornment, TextField } from "@mui/material";
import FieldTitle from "./FieldTitle";
import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import { useActionData } from "@remix-run/react";

const CardNumber = () => {
  const actionData = useActionData();
  const { getCardNumberProps, getCardImageProps, meta } = usePaymentInputs();

  return (
    <div>
      <FieldTitle title="Card number" required={true} />
      <TextField
        fullWidth
        type="tel"
        name="cardNumber"
        inputProps={{
          ...getCardNumberProps({}),
          placeholder: "Enter card number",
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
