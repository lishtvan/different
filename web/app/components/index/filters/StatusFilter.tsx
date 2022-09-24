import { Launch } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

const StatusFilter = () => {
  const [showSold, setShowSold] = useState(false);

  return (
    <div className="fixed bottom-2 left-3 w-[20.5rem] flex justify-center items-center">
      {showSold ? (
        <>
          <Button
            variant="contained"
            onClick={() => setShowSold(false)}
            className="w-3/4"
          >
            Show available
          </Button>
          <div className="ml-2">
            <Launch className="text-main" />
          </div>
        </>
      ) : (
        <>
          <Button
            variant="outlined"
            onClick={() => setShowSold(true)}
            className="w-3/4"
          >
            Show sold
          </Button>
          <div className="ml-2">
            <Launch className="text-main" />
          </div>
        </>
      )}
    </div>
  );
};

export default StatusFilter;
