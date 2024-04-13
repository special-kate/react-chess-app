import React, { useState } from "react";
import Chessboard from "chessboardjsx";
import CustomDialog from "../../CustomDialog.js";

import StockFish from "./integrations/Stockfish.js";

export default function Demo() {
  const [level, setLevel] = useState("");
  const [levelSubmitted, setLevelSubmitted] = useState(false);
  const [start, setStart] = useState(false);

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
  };

  return (
    <div style={{ height: "87vh" }}>
      <CustomDialog
        open={!levelSubmitted}
        handleClose={() => setLevelSubmitted(true)}
        title="Select an AI level"
        contentText=""
        handleContinue={() => {
          if (!level) return;
          setStart(true);
          setLevelSubmitted(true);
        }}
      >
        <div>
          <div>
            <label>
              <input
                type="radio"
                value="Easy"
                checked={level === "Easy"}
                onChange={handleLevelChange}
              />
              Easy
            </label>
          </div>
          <br></br>
          <div>
            <label>
              <input
                type="radio"
                value="Medium"
                checked={level === "Medium"}
                onChange={handleLevelChange}
              />
              Medium
            </label>
          </div>
          <br></br>
          <div>
            <label>
              <input
                type="radio"
                value="Hard"
                checked={level === "Hard"}
                onChange={handleLevelChange}
              />
              Hard
            </label>
          </div>
        </div>
      </CustomDialog>
      {start && (
        <div
          style={{
            margin: "3rem auto",
            maxWidth: "70vh",
            width: "70vw",
          }}
        >
          <StockFish level={level}>
            {({ position, onDrop }) => (
              <Chessboard
                id="stockfish"
                position={position}
                width={400}
                onDrop={onDrop}
                boardStyle={boardStyle}
                orientation="black"
                darkSquareStyle={{ backgroundColor: "rgb(183, 192, 216)" }}
                lightSquareStyle={{ backgroundColor: "rgb(232, 237, 249)" }}
              />
            )}
          </StockFish>
        </div>
      )}
    </div>
  );
}

const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
};
