import { useEffect, useState, useCallback } from "react";
import Game from "./Game";
import InitGame from "./InitGame";
import socket from "./socket";
import { accountService } from "../../../_services";

export default function Multiplayer() {
  const username = accountService.userValue.email.split("@")[0];

  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);

  socket.emit("username", username);

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
