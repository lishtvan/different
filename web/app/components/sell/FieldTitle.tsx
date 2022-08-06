import { Tooltip } from "@mui/material";
import type { FC } from "react";

interface Props {
  title: string;
  required: boolean;
}

const FieldTitle: FC<Props> = ({ title, required }) => (
  <div className="text-2xl mb-2 ml-2 flex">
    {required ? (
      <Tooltip
        title="Field is required"
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -5],
              },
            },
          ],
        }}
      >
        <div>{title} *</div>
      </Tooltip>
    ) : (
      <div>{title}</div>
    )}
  </div>
);

export default FieldTitle;
