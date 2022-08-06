import {
  InputAdornment,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import FieldTitle from "./FieldTitle";
import type { FC } from "react";

interface Props {
  error: string;
}

const Price: FC<Props> = ({ error }) => {
  return (
    <>
      <FieldTitle title="Price" required={true} />
      {error && <p className="ml-2 mb-1 text-[#d32f2f]">{error}</p>}
      <OutlinedInput
        placeholder="Enter item price"
        className="w-full"
        type="number"
        error={Boolean(error)}
        name="price"
        startAdornment={
          <InputAdornment position="start">
            <TextField
              className="bg-white border-0"
              select
              defaultValue={"₴"}
              variant="standard"
              name="currency"
              sx={{
                "& .MuiInput-input:focus": {
                  backgroundColor: "white",
                },
              }}
            >
              <MenuItem className="bg-white hover:bg-[#f8f4f4]" value={"$"}>
                $
              </MenuItem>
              <MenuItem className="bg-white hover:bg-[#f8f4f4]" value={"₴"}>
                ₴
              </MenuItem>
            </TextField>
          </InputAdornment>
        }
      />
    </>
  );
};

export default Price;
