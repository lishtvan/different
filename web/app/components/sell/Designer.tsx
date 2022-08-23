import { Autocomplete, TextField } from "@mui/material";
import { DESIGNERS } from "~/constants/listing";
import FieldTitle from "./FieldTitle";
import type { FC } from "react";

interface Props {
  error: string;
}
const Designer: FC<Props> = ({ error }) => (
  <div>
    <FieldTitle title="Designer" required={true} />
    <Autocomplete
      className="w-full"
      options={DESIGNERS}
      noOptionsText="If you haven't found a designer for your item, select 'Not Widespread' and put your designer's name in the title, we review listings with this mark and add new designers as soon as possible. You can also select Merch or Custom if thats your case"
      renderInput={(params) => (
        <TextField
          {...params}
          error={Boolean(error)}
          name="designer"
          placeholder="Select designer"
        />
      )}
    />
    {error && <p className="ml-2 mt-1 text-[#d32f2f]">{error}</p>}
  </div>
);

export default Designer;
