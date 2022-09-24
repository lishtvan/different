import CheckboxFilter from "./CheckboxFilter";
import StatusFilter from "./StatusFilter";

const Filters = () => {
  return (
    <div className="sticky top-20 h-screen w-[25.5rem]">
      <div className="top-20 sticky h-[82%] 2xl:h-[87.5%]  overflow-y-scroll scrollbar-white border">
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
