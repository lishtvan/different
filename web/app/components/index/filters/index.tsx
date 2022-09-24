import CheckboxFilter from "./CheckboxFilter";
import StatusFilter from "./StatusFilter";

const Filters = () => {
  return (
    <div className="sticky top-20 h-full">
      <div className="w-[25.5rem] h-[38.5rem] overflow-y-scroll scrollbar-white">
        <CheckboxFilter enableSearch={true} attribute="designer" />
        <CheckboxFilter enableSearch={false} attribute="category" />
        <CheckboxFilter enableSearch={false} attribute="size" />
        <CheckboxFilter enableSearch={false} attribute="condition" />
        <CheckboxFilter enableSearch={false} attribute="tags" />
        <CheckboxFilter enableSearch={false} attribute="price" />
      </div>
      <StatusFilter />
    </div>
  );
};

export default Filters;
