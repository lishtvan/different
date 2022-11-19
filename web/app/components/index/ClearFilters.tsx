import { Clear } from "@mui/icons-material";
import type { CurrentRefinementsConnectorParamsRefinement } from "instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
        <div className="text-xl font-bold min-w-fit">
          {results?.nbHits} {t("listings")}{" "}
          {refinements.length > 0 ? t("for") : t("available")}
        </div>
      ) : (
        <div className="text-xl font-bold min-w-fit">
          {results?.nbHits} {t("sold items")} {refinements.length > 0 && t("for")}
        </div>
      )}
      {refinements.length > 0 && (
        <div className="flex max-w-[60%] ml-2 flex-wrap max-h-20 overflow-x-hidden overflow-y-scroll scrollbar-visible">
          {refinements.map((item) => (
            <button
              key={item.label}
              onClick={() => refine(item)}
              className="text-xl border-main hover:bg-[#f2f2f5] rounded-md text-main border m-1 pl-2 pr-1"
            >
              {t(item.label)} <Clear />
            </button>
          ))}
        </div>
      )}

      {refinements.length > 2 && (
        <button
          onClick={() => clear.refine()}
          className="text-xl min-w-fit underline underline-offset-2 pl-2 px-1 ml-1 mr-4"
        >
          Clear All
        </button>
      )}
    </>
  );
};

export default ClearFilters;
