import React, { useState } from "react";
import CustomDialog from "../../CustomDialog";
import socket from "./socket";

export default function InitGame({ setRoom, setOrientation, setPlayers }) {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState("");
  const [roomError, setRoomError] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CustomDialog
        open={roomDialogOpen}
        handleClose={() => setRoomDialogOpen(false)}
        title="Select Room to Join"
        contentText="Enter a valid room ID to join the room"
        handleContinue={() => {
          if (!roomInput) return;
          socket.emit("joinRoom", { roomId: roomInput }, (r) => {
            if (r.error) return setRoomError(r.message);
            console.log("response:", r);
            setRoom(r?.roomId);
            setPlayers(r?.players);
            setOrientation("black");
            setRoomDialogOpen(false);
          });
        }}
      >
        <input
          autoFocus
          className="w-full px-3 py-2 border rounded-md"
          id="room"
          placeholder="Room ID"
          value={roomInput}
          required
          onChange={(e) => setRoomInput(e.target.value)}
          type="text"
        />
        {roomError && (
          <p className="text-red-500 text-sm mt-1">
            Invalid room ID: {roomError}
          </p>
        )}
      </CustomDialog>
      <button
        onClick={() => {
          socket.emit("createRoom", (r) => {
            console.log(r);
            setRoom(r);
            setOrientation("white");
          });
        }}
        className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start a game
      </button>
      <button
        onClick={() => setRoomDialogOpen(true)}
        className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Join a game
      </button>
    </div>
  );
}
