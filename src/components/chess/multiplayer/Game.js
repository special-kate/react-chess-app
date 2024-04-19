import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "../../CustomDialog";
import socket from "./socket";
import $ from "jquery";

function Game({ players, room, orientation, cleanup, user }) {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");
  const [status, setStatus] = useState("");

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move);
        setFen(chess.fen());

        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            );
          } else if (chess.isDraw()) {
            setOver("Draw");
          } else {
            setOver("Game over");
          }
        }

        return result;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    [chess]
  );

  function onDrop(sourceSquare, targetSquare) {
    if (chess.turn() !== orientation[0]) return false;

    if (players.length < 2) return false;

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q",
    };

    const move = makeAMove(moveData);

    if (move === null) return false;

    socket.emit("move", {
      move,
      room,
    });

    console.log("hi-----------", players, user);
    setStatus(
      `${players.find((item) => item.username !== user).username}'s turn`
    );

    return true;
  }

  const getAllAvailablePaths = (square) => {
    chess.load(chess.fen());

    // Generate all legal moves for both white and black pieces
    const legalMoves = chess.moves({ verbose: true });

    // Extract the moves starting from the given square
    const movesFromSquare = legalMoves.filter((move) => move.from === square);

    // Extract the destination squares from the filtered moves
    const availablePaths = movesFromSquare.map((move) => move.to);

    return availablePaths;
  };

  function onMouseOver(square) {
    // get list of possible moves for this square
    var moves = chess.moves({
      square: square,
      verbose: true,
    });

    console.log("------------over", square, getAllAvailablePaths(square));

    // highlight the square they moused over
    greySquare(square);

    // skip if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
    }
  }

  function onMouseOut(square) {
    // Remove grey squares for the current square
    removeGreySquares();
  }

  var removeGreySquares = function () {
    var squareElements = $("[data-square]").toArray();
    console.log(squareElements[0]);
    squareElements.forEach((element) => {
      var $element = $(element); // Wrap the DOM element in a jQuery object
      if ($element.attr("data-square-color") === "black") {
        $element.css("background-color", "#B7C0D8");
      } else $element.css("background-color", "#E8EDF9");
    });
  };

  var greySquare = function (square) {
    var squareEl = $("[data-square=" + square + "]"),
      background = "#fbe3e7";
    if (squareEl.hasClass("black-3c85d") === true) background = "#f7c5cd";
    squareEl.css("background-color", background);
  };

  useEffect(() => {
    socket.on("playerDisconnected", (player) => {
      setOver(`${player.username} has disconnected`);
    });
  }, []);

  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move);
      setStatus("It's your turn");
    });
  }, [makeAMove]);

  useEffect(() => {
    socket.on("closeRoom", ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
  }, [room, cleanup]);

  useEffect(() => {
    setStatus(
      players.length === 0
        ? "Waiting for opponant..."
        : "Start a game with white player."
    );
  }, [players]);
  console.log(players);
  return (
    <div className="flex flex-col grid-cols-3 items-center">
      <div className="flex col-span-2 justify-between w-full max-w-screen-lg">
        <div
          className="board"
          style={{
            margin: "1rem auto",
            maxWidth: "80vh",
            width: "80vw",
          }}
        >
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={orientation}
            customDarkSquareStyle={{ backgroundColor: "#B7C0D8" }}
            customLightSquareStyle={{ backgroundColor: "#E8EDF9" }}
            onMouseOverSquare={onMouseOver}
            onMouseOutSquare={onMouseOut}
          />
        </div>
        <div className="col-span-1" style={{ margin: "1rem auto" }}>
          <p className="bg-white shadow-md p-4">
            <span className="font-bold">Room ID: </span>
            {room}
          </p>
          {players.length > 1 && (
            <>
              <div className="p-5 font-bold flex justify-center">Players</div>
              <ul className="px-5  list-inside">
                <li className="flex justify-center mb-2">
                  {players[0].username === user ? "You" : players[0].username}
                </li>
                <li className="flex justify-center mb-2">
                  {players[1].username === user ? "You" : players[1].username}
                </li>
              </ul>
            </>
          )}
          <div className="flex justify-between">
            <div className="status my-7 ml-2 text-red-500">{status}</div>
            <button
              className="my-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <CustomDialog
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          socket.emit("closeRoom", { roomId: room });
          cleanup();
        }}
      />
    </div>
  );
}

export default Game;
