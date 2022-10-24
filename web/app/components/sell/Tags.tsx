import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { TAGS } from "~/constants/listing";
import FieldTitle from "./FieldTitle";

const Tags = () => {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div>
      <FieldTitle title="Tags" required={false} />
      <input hidden name="tags" readOnly value={tags} />
      <Autocomplete
        className="w-full"
        multiple
        options={tags.length === 3 ? [] : TAGS}
        freeSolo={tags.length < 3}
        disableCloseOnSelect
        blurOnSelect={tags.length === 2}
        value={tags}
        noOptionsText="You can set maximum 3 tags"
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
              tags.length ? "" : "Make the search of your item easier"
            }
          />
        )}
      />
    </div>
  );
};

export default Tags;
