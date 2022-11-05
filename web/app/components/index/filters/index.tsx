import CategoryFilter from "./CategoryFilter";
import CheckboxFilter from "./CheckboxFilter";
import PriceFilter from "./PriceFilter";
import StatusFilter from "./StatusFilter";

const Filters = () => {
  return (
    <div className="sticky top-[74px] h-screen min-w-[320px] max-w-[320px] hidden sm:block">
      <div className="top-[74px] sticky h-[calc(93%-74px)] overflow-y-scroll scrollbar-white">
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
