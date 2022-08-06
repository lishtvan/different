import { TextField } from "@mui/material";
import FieldTitle from "./FieldTitle";

const Description = () => (
  <>
    <FieldTitle title="Description" required={false} />
    <TextField
      rows={3}
      name="description"
      multiline
      inputProps={{
        maxLength: 1000,
      }}
      className="w-full"
      placeholder="Add more information about condition of item, how does it fit, measurements, expierence of wearing, materials, etc. (up to 1000 characters)"
    />
  </>
);

export default Description;
