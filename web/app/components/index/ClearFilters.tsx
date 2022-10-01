import { Clear } from "@mui/icons-material";

const ClearFilters = () => {
  return (
    <>
      <div className="text-xl font-bold min-w-fit">4 listings for:</div>
      <div className="flex max-w-[60%] border ml-2 flex-wrap max-h-20 overflow-x-hidden overflow-y-scroll scrollbar-visible">
        {[
          "Yves Saint Laurent",
          "Gucci",
          "Prada",
          "T-shirts",
          "#Vintage",
          "Jackets",
          "Boots",
          "Stone Island",
          "Dior",
          "Chanel",
          "US 8.5 / EU 41-42",
          "Dior",
          "Chanel",
          "US 8.5 / EU 41-42",
        ].map((item, index) => (
          <div
            key={index}
            className="text-xl border-main hover:bg-[#f2f2f5] text-main border m-1 pl-2 px-1 gap-1"
          >
            {item} <Clear />
          </div>
        ))}
      </div>
      <button className="text-xl min-w-fit underline underline-offset-2 pl-2 px-1 ml-2 mr-4">
        Clear All
      </button>
    </>
  );
};

export default ClearFilters;
