import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "../../CustomDialog";
import $ from "jquery";
import socket from "./socket";
import { accountService } from "../../../_services";

import wP from "../img/pieces/wP.svg";
import wK from "../img/pieces/wK.svg";
import wN from "../img/pieces/wN.svg";
import wB from "../img/pieces/wB.svg";
import wR from "../img/pieces/wR.svg";
import wQ from "../img/pieces/wQ.svg";

import bP from "../img/pieces/bP.svg";
import bK from "../img/pieces/bK.svg";
import bN from "../img/pieces/bN.svg";
import bB from "../img/pieces/bB.svg";
import bR from "../img/pieces/bR.svg";
import bQ from "../img/pieces/bQ.svg";

function Game({ darkMode, level }) {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");
  const [status, setStatus] = useState("");

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);
  const [timer, setTimer] = useState(level * 60);
  const [moveTimer, setMoveTimer] = useState(15);

  const pieceTheme = {
    wP: () => <img src={wP} alt="wp" />,
    wK: () => <img src={wK} alt="wK" />,
    wN: () => <img src={wN} alt="wN" />,
    wB: () => <img src={wB} alt="wB" />,
    wR: () => <img src={wR} alt="wR" />,
    wQ: () => <img src={wQ} alt="wQ" />,

    bP: () => <img src={bP} alt="bP" />,
    bK: () => <img src={bK} alt="bK" />,
    bN: () => <img src={bN} alt="bN" />,
    bB: () => <img src={bB} alt="bB" />,
    bR: () => <img src={bR} alt="bR" />,
    bQ: () => <img src={bQ} alt="bQ" />,
  };

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

    setStatus(
      `${players.find((item) => item.username !== username).username}'s turn`
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

  const startTimer = (roomValue) => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer > 0 ? prevTimer - 1 : 0;
        socket.emit("updateTimer", { timer: newTimer, room: roomValue });
        return newTimer;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  };

  const startMoveTimer = () => {
    const moveIntervalId = setInterval(() => {
      setMoveTimer((prevMoveTimer) => {
        const newMoveTimer = prevMoveTimer > 0 ? prevMoveTimer - 1 : 0;
        return newMoveTimer;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(moveIntervalId);
  };

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  useEffect(() => {
    socket.on("playerDisconnected", (player) => {
      setOver(`${player.username} has disconnected`);
    });

    socket.on("updateTimer", (newTimer) => {
      setTimer(newTimer);
    });

    socket.on("closeRoom", ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });

    if (!accountService.userValue && !level) {
      return;
    } else {
      setUsername(accountService.userValue.email.split("@")[0]);
      socket.emit("username", accountService.userValue.email.split("@")[0]);

      socket.emit(
        "joinRoom",
        { username: accountService.userValue.email.split("@")[0], time: level },
        (r) => {
          if (r.error) {
            socket.emit(
              "createRoom",
              {
                username: accountService.userValue.email.split("@")[0],
                time: level,
              },
              (r) => {
                setRoom(r);
                setOrientation("white");
              }
            );
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

      socket.on("moveTimeDue", (user) => {
        setOver(`You win this game with ${user}'s no response within 15s.`);
        cleanup();
      });
    }
  }, []);

  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move);
      setMoveTimer(15);
      startMoveTimer();
      setStatus("It's your turn");
    });
  }, [makeAMove]);

  useEffect(() => {
    setStatus(
      players.length < 2
        ? "Waiting for opponant..."
        : "Start a game with white player."
    );
  }, [players]);

  useEffect(() => {
    if (timer === 0) {
      setOver("Time is due. This game ends in a draw.");
      cleanup();
    }

    if (moveTimer === 0) {
      socket.emit("moveTimeDue", { username: username, room: room });
      setOver(
        `Time is due. You have lost this game with no reaction within 15s.`
      );
      cleanup();
    }
  }, [timer, moveTimer]);

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
            customPieces={pieceTheme}
          />
        </div>
        <div className="col-span-1" style={{ margin: "1rem auto" }}>
          <p
            className={`${
              darkMode
                ? "bg-black text-white shadow-blue-500"
                : "bg-white text-black"
            } shadow-md p-4`}
          >
            <span className="font-bold">Time left: </span>
            {`${Math.floor(timer / 60)} : ${timer % 60}`}
          </p>
          {players.length > 1 && (
            <div className={`${darkMode ? "text-white" : "text-black"}`}>
              <div className="p-5 font-bold flex justify-center">Players</div>
              <ul className="px-5  list-inside">
                <li className="flex justify-center mb-2">
                  {players[0].username === username
                    ? "You"
                    : players[0].username}
                </li>
                <li className="flex justify-center mb-2">
                  {players[1].username === username
                    ? "You"
                    : players[1].username}
                </li>
              </ul>
            </div>
          )}
          <div className="col-span-1 justify-center">
            <div className="status my-7 ml-2 text-red-500">{status}</div>
            <div className="grid place-items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  socket.emit("closeRoom", { roomId: room });
                  cleanup();
                  window.location.href = "/";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <CustomDialog
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          socket.emit("closeRoom", { roomId: room });
          window.location.href = "/";
        }}
      />
    </div>
  );
}

export default Game;
