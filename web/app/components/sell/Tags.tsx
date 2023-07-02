import { Autocomplete, TextField } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { TAGS } from "~/constants/listing";
import FieldTitle from "./FieldTitle";

const Tags = () => {
  const loaderData = useLoaderData();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (loaderData?.tags?.length > 0) setTags(loaderData.tags);
  }, [loaderData.tags]);

  return (
    <div className="col-start-1 col-end-3">
      <FieldTitle title={"Теги"} required={false} />
      <input hidden name="tags" readOnly value={tags} />
      <Autocomplete
        className="w-full"
        multiple
        options={tags.length === 3 ? [] : TAGS}
        freeSolo={tags.length < 3}
        disableCloseOnSelect
        blurOnSelect={tags.length === 2}
        value={tags}
        noOptionsText={"Ви можете обрати максимум 3 теги"}
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
              tags.length ? "" : "Зробіть пошук свого оголошення простішим"
            }
          />
        )}
      />
    </div>
  );
};

export default Tags;
