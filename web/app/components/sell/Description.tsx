import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import FieldTitle from "./FieldTitle";

const Description = () => {
  const { t } = useTranslation();

  return (
    <div className="col-start-1 col-end-3">
      <FieldTitle title={t("Description")} required={false} />
      <TextField
        rows={3}
        name="description"
        multiline
        inputProps={{
          maxLength: 1000,
        }}
        className="w-full"
        placeholder={t(
          "Add more information about condition of item, how does it fit, measurements, expierence of wearing, materials, etc. (up to 1000 characters)"
        )!}
      />
    </div>
  );
};
export default Description;
