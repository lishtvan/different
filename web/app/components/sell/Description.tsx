import { TextField } from "@mui/material";
import FieldTitle from "./FieldTitle";

const Description = () => (
  <div className="col-start-1 col-end-3">
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
  </div>
);

export default Description;
