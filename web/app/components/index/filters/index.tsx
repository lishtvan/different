import { useHits } from "react-instantsearch-hooks-web";
import CheckboxFilter from "./CheckboxFilter";

const Filters = () => {
  const { results } = useHits();
  return (
    <div className="sticky top-20 h-full">
      <div className="ml-4 mb-3 font-bold underline underline-offset-4">
        {results?.nbHits} listings
      </div>
      <div className="w-[25.5rem] h-[610px] overflow-y-scroll scrollbar-white">
        <CheckboxFilter enableSearch={true} attribute="designer" />
        <CheckboxFilter enableSearch={false} attribute="category" />
        <CheckboxFilter enableSearch={false} attribute="size" />
        <CheckboxFilter enableSearch={false} attribute="condition" />
        <CheckboxFilter enableSearch={false} attribute="tags" />
        <CheckboxFilter enableSearch={false} attribute="price" />
      </div>
    </div>
  );
};

export default Filters;

/* <div className="flex justify-center items-center w-full sticky bottom-0 mt-5">
<Button variant="outlined" className="w-3/4">
  Show sold
</Button>
<div className="ml-2">
  <Launch className="text-main" />
</div>
</div> */
