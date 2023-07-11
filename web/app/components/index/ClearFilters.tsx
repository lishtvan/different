import { Clear } from "@mui/icons-material";
import type { CurrentRefinementsConnectorParamsRefinement } from "instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements";
import { useEffect, useState } from "react";
import {
  useClearRefinements,
  useCurrentRefinements,
  useHits,
} from "react-instantsearch-hooks-web";

const ClearFilters = () => {
  const clear = useClearRefinements({
    excludedAttributes: ["status"],
  });
  const { refine, items } = useCurrentRefinements({
    excludedAttributes: ["price", "query", "status"],
  });

  const soldFilters = useCurrentRefinements({
    excludedAttributes: [
      "price",
      "query",
      "designer",
      "tags",
      "category",
      "condition",
      "size",
    ],
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
      {soldFilters?.items[0]?.refinements[0]?.label === "AVAILABLE" ? (
        <div className="min-w-fit text-xl font-bold">
          {results?.nbHits} оголошень{" "}
          {refinements.length > 0 ? "для" : "в наявності"}
        </div>
      ) : (
        <div className="min-w-fit text-xl font-bold">
          {results?.nbHits} проданих речей {refinements.length > 0 && "для"}
        </div>
      )}
      {refinements.length > 0 && (
        <div className="scrollbar-visible ml-2 flex max-h-20 max-w-[60%] flex-wrap overflow-x-hidden overflow-y-scroll">
          {refinements.map((item) => (
            <button
              key={item.label}
              onClick={() => refine(item)}
              className="m-1 rounded-md border border-main pl-2 pr-1 text-xl text-main hover:bg-[#f2f2f5]"
            >
              {item.label} <Clear />
            </button>
          ))}
        </div>
      )}

      {refinements.length > 2 && (
        <button
          onClick={() => clear.refine()}
          className="ml-1 mr-4 min-w-fit px-1 pl-2 text-xl underline underline-offset-2"
        >
          Видалити все
        </button>
      )}
    </>
  );
};

export default ClearFilters;
