import { Autocomplete, TextField } from "@mui/material";
import { DESIGNERS } from "~/constants/listing";
import FieldTitle from "./FieldTitle";
import { useActionData } from "@remix-run/react";

const Designer = () => {
  const actionData = useActionData();

  return (
    <div>
      <FieldTitle title="Designer" required={true} />
      <Autocomplete
        className="w-full"
        options={DESIGNERS}
        noOptionsText="If you haven't found a designer for your item, select 'Unknown' and put your designer's name in the title, we review listings with this mark and add new designers as soon as possible. You can also select Vintage or Custom if thats your case."
        renderInput={(params) => (
          <TextField
            {...params}
            error={Boolean(actionData?.errors?.designer)}
            name="designer"
            placeholder="Select designer"
          />
        )}
      />
      {actionData?.errors?.designer && (
        <p className="ml-2 mt-1 text-[#d32f2f]">{actionData.errors.designer}</p>
      )}
    </div>
  );
};

export default Designer;
