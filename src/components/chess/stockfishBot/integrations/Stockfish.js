import React, { useEffect, useState } from "react";
import { Chess } from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess not being a constructor

const STOCKFISH = window.STOCKFISH;
const game = new Chess();

const Stockfish = ({ children, level }) => {
  console.log("children", level);

  const enginePath = level === "Easy" ? "" : level === "Medium" ? "" : "";

  const [fen, setFen] = useState("start");

  useEffect(() => {
    setFen(game.fen());
    engineGame().prepareMove();
  }, []);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) return;

      return new Promise((resolve) => {
        setFen(game.fen());
        resolve();
      }).then(() => engineGame().prepareMove());
    } catch (e) {
      console.log("error", e);
      return;
    }
  };

  const engineGame = (options) => {
    options = options || {};

    let engine =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(
            options.stockfishjs || "bots/stockfish.js-10.0.2/stockfish.js"
          );
    let evaler =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(
            options.stockfishjs || "bots/stockfish.js-10.0.2/stockfish.js"
          );
    let engineStatus = {};
    let time = { wtime: 300, btime: 300, winc: 150, binc: 150 };
    let playerColor = "black";
    let clockTimeoutID = null;
    let announced_game_over;

    setInterval(function () {
      if (announced_game_over) {
        return;
      }

      if (game.game_over) {
        announced_game_over = true;
      }
    }, 500);

    function uciCmd(cmd, which) {
      console.log("cmd", cmd);
      (which || engine).postMessage(cmd);
    }
    uciCmd("uci");

    function clockTick() {
      let t =
        (time.clockColor === "white" ? time.wtime : time.btime) +
        time.startTime -
        Date.now();

      let timeToNextSecond = (t % 1000) + 1;
      clockTimeoutID = setTimeout(clockTick, timeToNextSecond);
    }

    function stopClock() {
      if (clockTimeoutID !== null) {
        clearTimeout(clockTimeoutID);
        clockTimeoutID = null;
      }
      if (time.startTime > 0) {
        let elapsed = Date.now() - time.startTime;
        time.startTime = null;
        if (time.clockColor === "white") {
          time.wtime = Math.max(0, time.wtime - elapsed);
        } else {
          time.btime = Math.max(0, time.btime - elapsed);
        }
      }
    }

    function startClock() {
      if (game.turn() === "w") {
        time.wtime += time.winc;
        time.clockColor = "white";
      } else {
        time.btime += time.binc;
        time.clockColor = "black";
      }
      time.startTime = Date.now();
      clockTick();
    }

    function get_moves() {
      let moves = "";
      let history = game.history({ verbose: true });

      for (let i = 0; i < history.length; ++i) {
        let move = history[i];
        moves +=
          " " + move.from + move.to + (move.promotion ? move.promotion : "");
      }

      return moves;
    }

    const prepareMove = () => {
      stopClock();
      let turn = game.turn() === "w" ? "white" : "black";
      if (!game.game_over) {
        if (turn !== playerColor) {
          uciCmd("position startpos moves" + get_moves());
          uciCmd("position startpos moves" + get_moves(), evaler);
          uciCmd("eval", evaler);

          if (time && time.wtime) {
            uciCmd(
              "go " +
                (time.depth ? "depth " + time.depth : "") +
                " wtime " +
                time.wtime +
                " winc " +
                time.winc +
                " btime " +
                time.btime +
                " binc " +
                time.binc
            );
          } else {
            uciCmd("go " + (time.depth ? "depth " + time.depth : ""));
          }
        }
        if (game.history().length >= 2 && !time.depth && !time.nodes) {
          startClock();
        }
      }
    };

    evaler.onmessage = function (event) {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }

      if (
        line === "uciok" ||
        line === "readyok" ||
        line.substr(0, 11) === "option name"
      ) {
        return;
      }
    };

    engine.onmessage = (event) => {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }

      if (line === "uciok") {
        engineStatus.engineLoaded = true;
      } else if (line === "readyok") {
        engineStatus.engineReady = true;
      } else {
        try {
          let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
          console.log("match", match);
          if (match !== null) {
            game.move({ from: match[1], to: match[2], promotion: match[3] });
            setFen(game.fen());
            prepareMove();
            uciCmd("eval", evaler);
          } else if (
            (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))
          ) {
            engineStatus.search = "Depth: " + match[1] + " Nps: " + match[2];
          }

          if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
            let score = parseInt(match[2], 10) * (game.turn() === "w" ? 1 : -1);
            if (match[1] === "cp") {
              engineStatus.score = (score / 100.0).toFixed(2);
            } else if (match[1] === "mate") {
              engineStatus.score = "Mate in " + Math.abs(score);
            }

            if ((match = line.match(/\b(upper|lower)bound\b/))) {
              engineStatus.score =
                ((match[1] === "upper") === (game.turn() === "w")
                  ? "<= "
                  : ">= ") + engineStatus.score;
            }
          }
        } catch (e) {
          console.log("error", e);
          return;
        }
      }
    };

    return {
      start: function () {
        uciCmd("ucinewgame");
        uciCmd("isready");
        engineStatus.engineReady = false;
        engineStatus.search = null;
        prepareMove();
        announced_game_over = false;
      },
      prepareMove: function () {
        prepareMove();
      },
    };
  };

  return children({ position: fen, onDrop: onDrop });
};

export default Stockfish;
