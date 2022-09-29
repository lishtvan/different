import CategoryFilter from "./CategoryFilter";
import CheckboxFilter from "./CheckboxFilter";
import PriceFilter from "./PriceFilter";
import StatusFilter from "./StatusFilter";

const Filters = () => {
  return (
    <div className="sticky top-20 h-screen min-w-[320px] max-w-[320px] hidden sm:block">
      <div className="top-20 sticky h-[82%] 2xl:h-[87.5%] overflow-y-scroll scrollbar-white border">
        <CheckboxFilter enableSearch={true} attribute="designer" />
        <CategoryFilter />
        <CheckboxFilter enableSearch={false} attribute="size" />
        <CheckboxFilter enableSearch={false} attribute="condition" />
        <CheckboxFilter enableSearch={false} attribute="tags" />
        <PriceFilter />
      </div>
      <StatusFilter />
    </div>
  );
};

export default Filters;
