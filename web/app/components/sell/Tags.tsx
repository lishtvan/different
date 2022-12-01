import { Autocomplete, TextField } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TAGS } from "~/constants/listing";
import FieldTitle from "./FieldTitle";

const Tags = () => {
  const loaderData = useLoaderData();
  const [tags, setTags] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!loaderData.tags) return;
    const formattedTags = loaderData.tags.split(",");
    console.log(formattedTags);
    setTags(formattedTags);
  }, [loaderData.tags]);

  return (
    <div>
      <FieldTitle title={t("Tags")} required={false} />
      <input hidden name="tags" readOnly value={tags} />
      <Autocomplete
        className="w-full"
        multiple
        options={tags.length === 3 ? [] : TAGS}
        freeSolo={tags.length < 3}
        disableCloseOnSelect
        blurOnSelect={tags.length === 2}
        value={tags}
        noOptionsText={t("You can set maximum 3 tags")}
        onChange={(e, newVal) => {
          const newTags = [...newVal];
          if (newTags.length) {
            const lastTag = newTags[newTags.length - 1];
            if (!lastTag.startsWith("#")) {
              newTags.pop();
              newTags.push(`#${lastTag}`);
            }
          }
          setTags(newTags);
        }}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              maxLength: 20,
            }}
            disabled={tags.length === 3}
            placeholder={
              tags.length ? "" : t("Make the search of your item easier")!
            }
          />
        )}
      />
    </div>
  );
};

export default Tags;
