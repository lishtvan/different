import { InputAdornment, TextField } from "@mui/material";
import FieldTitle from "./FieldTitle";
import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import type { FC } from "react";

interface Props {
  error: string;
}

const CardNumber: FC<Props> = ({ error }) => {
  const { getCardNumberProps, getCardImageProps, meta } = usePaymentInputs();

  return (
    <>
      <FieldTitle title="Card number" required={true} />
      {error && <p className="ml-2 mb-1 text-[#d32f2f]">{error}</p>}
      <TextField
        fullWidth
        type="tel"
        name="cardNumber"
        inputProps={getCardNumberProps({})}
        error={(meta.isTouched && Boolean(meta.error)) || Boolean(error)}
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
    </>
  );
};

export default CardNumber;
