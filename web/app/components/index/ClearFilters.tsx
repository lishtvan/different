import { Clear } from "@mui/icons-material";
import type { CurrentRefinementsConnectorParamsRefinement } from "instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements";
import { useEffect, useState } from "react";
import {
  useClearRefinements,
  useCurrentRefinements,
  useHits,
} from "react-instantsearch-hooks-web";

const ClearFilters = () => {
  const clear = useClearRefinements();
  const { refine, items } = useCurrentRefinements({
    excludedAttributes: ["price", "query"],
  });
  const { results } = useHits();

  const [refinements, setRefinements] = useState<
    CurrentRefinementsConnectorParamsRefinement[]
  >([]);

  useEffect(() => {
    const newRefinements: CurrentRefinementsConnectorParamsRefinement[] = [];
    items.forEach((item) => newRefinements.push(...item.refinements));
    setRefinements(newRefinements);
  }, [items]);

  return (
    <>
      <div className="text-xl font-bold min-w-fit">
        {results?.nbHits} listings{" "}
        {refinements.length > 0 ? "for:" : "available"}
      </div>
      <div className="flex max-w-[60%] border rounded ml-2 flex-wrap max-h-20 overflow-x-hidden overflow-y-scroll scrollbar-visible">
        {refinements?.map((item) => (
          <button
            key={item.label}
            onClick={() => refine(item)}
            className="text-xl border-main hover:bg-[#f2f2f5] rounded text-main border m-1 pl-2 pr-1"
          >
            {item.label} <Clear />
          </button>
        ))}
      </div>
      {refinements.length > 2 && (
        <button
          onClick={() => clear.refine()}
          className="text-xl min-w-fit underline underline-offset-2 pl-2 px-1 ml-2 mr-4"
        >
          Clear All
        </button>
      )}
    </>
  );
};

export default ClearFilters;
