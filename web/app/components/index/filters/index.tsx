import CategoryFilter from "./CategoryFilter";
import CheckboxFilter from "./CheckboxFilter";
import PriceFilter from "./PriceFilter";
import StatusFilter from "./StatusFilter";

const Filters = () => {
  return (
    <div className="sticky top-[74px] hidden h-screen min-w-[320px] max-w-[320px] sm:block">
      <div className="scrollbar-white sticky top-[74px] h-[calc(93%-74px)] overflow-y-scroll">
        <PriceFilter />
        <CheckboxFilter enableSearch={true} attribute="designer" />
        <CategoryFilter />
        <CheckboxFilter enableSearch={false} attribute="size" />
        <CheckboxFilter enableSearch={false} attribute="condition" />
        <CheckboxFilter enableSearch={false} attribute="tags" />
      </div>
      <StatusFilter />
    </div>
  );
};

export default Filters;
