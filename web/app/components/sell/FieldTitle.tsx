import { Tooltip } from "@mui/material";
import type { FC } from "react";

interface Props {
  title: string;
  required: boolean;
}

const FieldTitle: FC<Props> = ({ title, required }) => {
  return (
    <div className="mb-2 ml-2 flex text-xl">
      {required ? (
        <Tooltip
          title={"Це поле є обов'язковим"}
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
};

export default FieldTitle;
