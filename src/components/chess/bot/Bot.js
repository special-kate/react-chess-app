import React, { useState } from "react";
import { Link } from "react-router-dom";

const Bot = () => {
  const [level, setLevel] = useState("7");

  const handleLevelChange = (event) => {
    console.log(level);
    setLevel(event.target.value);
  };

  return (
    <div className="content">
      <div className="chess-area">
        <div className="board-table">
          <div id="board" className="board"></div>
        </div>
        <div>
          <div className="board-settings pt-5 mt-5">
            <div className="font-bold text-xl mb-4">Select AI level</div>
            <div className="select-level">
              <div>
                <label>
                  <input
                    type="radio"
                    value="7"
                    checked={level === "7"}
                    onChange={handleLevelChange}
                    className="mr-2"
                  />
                  Easy
                </label>
              </div>
              <br></br>
              <div>
                <label>
                  <input
                    type="radio"
                    value="14"
                    checked={level === "14"}
                    onChange={handleLevelChange}
                    className="mr-2"
                  />
                  Medium
                </label>
              </div>
              <br></br>
              <div>
                <label>
                  <input
                    type="radio"
                    value="20"
                    checked={level === "20"}
                    onChange={handleLevelChange}
                    className="mr-2"
                  />
                  Hard
                </label>
              </div>
            </div>

            <div className="value hidden" id="game-difficulty-skill-value">
              {level}
            </div>

            {/* <div className="turns-history" id="game-turns-history">
            <ol></ol>
          </div> */}

            <div className="flex sm:flex-row sm:justify-between my-5">
              <Link
                // to="/bot"
                onClick={() =>
                  (window.location.href = window.location.pathname)
                }
                className="flex-col w-full mr-2 items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                New
              </Link>
              <Link
                to="/"
                className="flex-col w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Cancel
              </Link>
            </div>

            <div id="board-controls" className="controls text-red-500">
              <div className="status">
                <span id="game-state" className="hidden"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bot;
