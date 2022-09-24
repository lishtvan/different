import { Launch } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

const StatusFilter = () => {
  const [showSold, setShowSold] = useState(false);

  return (
    <div className="flex justify-center items-center mt-3">
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
