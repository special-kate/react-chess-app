import { useEffect, useState } from "react";
import Game from "./Game";
import { accountService } from "../../../_services/account.service";

import CustomDialog from "../../CustomDialog";

export default function Multiplayer({ darkMode }) {
  const [level, setLevel] = useState(null);
  const [levelSubmitted, setLevelSubmitted] = useState(false);
  const [start, setStart] = useState(false);

  const handleLevelChange = (event) => {
    setLevel(parseInt(event.target.value));
  };

  return (
    <div className="container mx-auto">
      <CustomDialog
        open={!levelSubmitted}
        handleClose={() => setLevelSubmitted(true)}
        title="Select time to play"
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
                value={1}
                checked={level === 1}
                onChange={handleLevelChange}
                className="mr-2"
              />
              1 min
            </label>
          </div>
          <br></br>
          <div>
            <label>
              <input
                type="radio"
                value={3}
                checked={level === 3}
                onChange={handleLevelChange}
                className="mr-2"
              />
              3 min
            </label>
          </div>
          <br></br>
          <div>
            <label>
              <input
                type="radio"
                value={5}
                checked={level === 5}
                onChange={handleLevelChange}
                className="mr-2"
              />
              5 min
            </label>
          </div>
        </div>
      </CustomDialog>
      {start && (
        <Game
          // room={room}
          // orientation={orientation}
          // username={username}
          // players={players}
          // // the cleanup function will be used by Game to reset the state when a game is over
          // cleanup={cleanup}
          // user={username}
          darkMode={darkMode}
          level={level}
        />
      )}
    </div>
  );
}
