import CheckboxFilter from "./CheckboxFilter";

const Filters = () => (
  <div className="w-[25.5rem] h-[610px] sticky top-20 overflow-y-scroll scrollbar-white">
    <CheckboxFilter enableSearch={true} attribute="designer" />
    <CheckboxFilter enableSearch={false} attribute="category" />
    <CheckboxFilter enableSearch={false} attribute="size" />
    <CheckboxFilter enableSearch={false} attribute="condition" />
    <CheckboxFilter enableSearch={false} attribute="tags" />
    <CheckboxFilter enableSearch={false} attribute="price" />
  </div>
);

export default Filters;

/* <div className="flex justify-center items-center w-full sticky bottom-0 mt-5">
<Button variant="outlined" className="w-3/4">
  Show sold
</Button>
<div className="ml-2">
  <Launch className="text-main" />
</div>
</div> */
