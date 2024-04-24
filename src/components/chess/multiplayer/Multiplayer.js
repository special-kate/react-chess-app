import { useEffect, useState, useCallback } from "react";
import Game from "./Game";
import socket from "./socket";
import { accountService } from "../../../_services";

export default function Multiplayer({ darkMode }) {
  const [username, setUsername] = useState("");
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
    if (!accountService.userValue) {
      return;
    } else {
      setUsername(accountService.userValue.email.split("@")[0]);
      socket.emit("username", accountService.userValue.email.split("@")[0]);

      socket.emit(
        "joinRoom",
        { user: accountService.userValue.email.split("@")[0] },
        (r) => {
          if (r.error) {
            socket.emit("createRoom", (r) => {
              setRoom(r);
              setOrientation("white");
            });
          } else {
            setRoom(r?.roomId);
            setPlayers(r?.players);
            setOrientation("black");
          }
        }
      );

      // Listen for opponentJoined event
      socket.on("opponentJoined", (roomData) => {
        setPlayers(roomData.players);
      });
    }
  }, []);

  return (
    <div className="container mx-auto">
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
    </div>
  );
}
