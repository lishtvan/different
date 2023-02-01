import { Tooltip } from "@mui/material";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  required: boolean;
}

const FieldTitle: FC<Props> = ({ title, required }) => {
  const { t } = useTranslation();
  return (
    <div className="mb-2 ml-2 flex text-2xl">
      {required ? (
        <Tooltip
          title={t("Field is required")}
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
