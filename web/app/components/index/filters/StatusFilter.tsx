import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useRefinementList } from "react-instantsearch-hooks-web";

const StatusFilter = () => {
  const [showSold, setShowSold] = useState(false);
  const { refine } = useRefinementList({ attribute: "status" });

  useEffect(() => {
    refine("AVAILABLE");
  }, []);

  return (
    <div className="fixed bottom-2 left-3 w-[20.5rem] flex justify-center items-center">
      {showSold ? (
        <Button
          variant="contained"
          onClick={() => {
            refine("SOLD");
            refine("AVAILABLE");
            setShowSold(false);
          }}
          className="w-3/4"
        >
          Show available
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={() => {
            refine("AVAILABLE");
            refine("SOLD");
            setShowSold(true);
          }}
          className="w-3/4"
        >
          Show sold
        </Button>
      )}
    </div>
  );
};

export default StatusFilter;
