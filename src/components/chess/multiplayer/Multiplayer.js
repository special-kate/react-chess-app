import { useEffect, useState, useCallback } from "react";
import Game from "./Game";
import InitGame from "./InitGame";
import socket from "./socket";
import { accountService } from "../../../_services";

export default function Multiplayer({ darkMode }) {
  const [username, setUsername] = useState(
    accountService.userValue.email.split("@")[0]
  );

  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      setPlayers(roomData.players);
    });
    if (accountService.userValue) {
      socket.emit("username", username);
    }
  }, []);

  return (
    <div className="container mx-auto">
      {room ? (
        <Game
          room={room}
          orientation={orientation}
          username={username}
          players={players}
          // the cleanup function will be used by Game to reset the state when a game is over
          cleanup={cleanup}
          user={username}
          darkMode={darkMode}
        />
      ) : (
        <InitGame
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
          username={username}
        />
      )}
    </div>
  );
}
