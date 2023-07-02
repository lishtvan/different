import { TextField } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import FieldTitle from "./FieldTitle";

const Description = () => {
  const loaderData = useLoaderData();

  return (
    <div className="col-start-1 col-end-3">
      <FieldTitle title={"Опис"} required={false} />
      <TextField
        rows={3}
        name="description"
        multiline
        defaultValue={loaderData?.description}
        inputProps={{
          maxLength: 1000,
        }}
        className="w-full"
        placeholder={
          "Додайте більше інформації про стан речі, її посадку, розміри, досвід використання, матеріали, тощо. (до 1000 символів)"
        }
      />
    </div>
  );
};
export default Description;
