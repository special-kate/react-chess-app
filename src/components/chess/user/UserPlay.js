import React, { useEffect, useState } from "react";

const UserPlay = () => {
  return (
    <div className="content">
      <div className="chess-area">
        <div className="board-table">
          <div id="board-top-controls" className="top-controls">
            <div id="game-promotion" className="promotion hidden">
              <span figure="q">Queen</span>
              <span figure="b">Bishop</span>
              <span figure="n">Knight</span>
              <span figure="r">Rook</span>
            </div>
            <div id="board-save-pgn-area" className="popup hidden">
              <span className="close"></span>
              <label>Save PGN Notation:</label>
              <textarea readOnly></textarea>
              <button>Close</button>
            </div>
            <div id="board-load-fen-area" className="popup hidden">
              <span className="close"></span>
              <label>Load FEN Notation:</label>
              <textarea></textarea>
              <button>Load</button>
            </div>
            <div id="board-load-pgn-area" className="popup large hidden">
              <span className="close"></span>
              <label>Load PGN Notation:</label>
              <textarea></textarea>
              <button>Load</button>
            </div>
            <div id="board-resign-game-area" className="popup hidden">
              <span className="close"></span>
              <label>Do you want to resign?</label>
              <button className="yes">Yes</button>
              <button className="no">No</button>
            </div>
          </div>
          <div id="board" className="board"></div>
          <div id="board-controls" className="controls">
            <div className="buttons">
              <button id="btn-switch-sides" title="Switch Sides">
                <i className="icon"></i>
              </button>
              <button id="btn-flip-board" title="Flip Board">
                <i className="icon"></i>
              </button>
              <button id="btn-save-pgn" title="Save PGN">
                <i className="icon"></i>
              </button>
              <button id="btn-engine-disable" title="Engine Toggle (On/Off)">
                AI
              </button>
              <button id="btn-show-hint" title="Show Hint">
                <i className="icon"></i>
              </button>
              <button id="btn-take-back" className="disabled" title="Take Back">
                <i className="icon"></i>
              </button>
            </div>
            <div className="status">
              <span id="game-turn" style={{ display: "none" }}>
                It's your turn!
              </span>
              <span id="game-state" className="hidden"></span>
            </div>
            <div
              id="board-messages"
              className="messages hidden"
              style={{ display: "none !important" }}
            ></div>
          </div>
        </div>
        <div className="board-settings">
          <div className="apex">
            <span className="label-history">Game History</span>
            <div
              className="game-level"
              id="game-difficulty-option"
              title="Choose The Engine's Skill Level"
            >
              <span className="label">Level</span>
              <span className="value" id="game-difficulty-skill-value">
                10
              </span>
            </div>
          </div>
          <div
            className="game-difficulty hidden"
            id="game-difficulty-skill-settings"
          >
            <span className="label">Select Engine's Level:</span>
            <span className="close"></span>
            <div className="values">
              <span className="1">1</span>
              <span className="2">2</span>
              <span className="3">3</span>
              <span className="4">4</span>
              <span className="5">5</span>
              <span className="6">6</span>
              <span className="7">7</span>
              <span className="8">8</span>
              <span className="9">9</span>
              <span className="10 selected">10</span>
              <span className="11">11</span>
              <span className="12">12</span>
              <span className="13">13</span>
              <span className="14">14</span>
              <span className="15">15</span>
              <span className="16">16</span>
              <span className="17">17</span>
              <span className="18">18</span>
              <span className="19">19</span>
              <span className="20">20</span>
            </div>
          </div>
          <div className="turns-history" id="game-turns-history">
            <ol></ol>
          </div>
          <div className="game-analyze hidden" id="game-analyze-string"></div>
          <div className="game-menu hidden" id="game-settings">
            <span className="label-choose-side">Select Side</span>
            <span
              className="btn game-white-side selected"
              id="btn-choose-white-side"
            ></span>
            <span
              className="btn game-black-side"
              id="btn-choose-black-side"
            ></span>
          </div>
          <div className="tunes">
            <span
              id="btn-new-game"
              title="Start New Game"
              className="btn-new-game"
            >
              <span className="icon"></span>
              <span className="label">New Game</span>
            </span>
            <span
              id="btn-settings"
              title="Choose The Engine's Skill Level"
              className="btn settings"
            ></span>
            <span id="btn-resign" title="Resign" className="btn resign"></span>
            <span
              id="btn-analyze"
              title="Request Engine Evaluation"
              className="btn analyze"
            >
              <i className="icon"></i>
            </span>
          </div>
          <div className="params">
            <div
              className="cell side"
              id="game-player-side"
              style={{ display: "none" }}
            >
              <label>Your Side:</label>
              <span className="white active">White</span>
              <span className="black">Black</span>
            </div>
            <div
              className="cell first-turn"
              id="game-first-turn"
              style={{ display: "none" }}
            >
              <label>First Turn:</label>
              <span className="player active">Player</span>
              <span className="computer">Computer</span>
            </div>
          </div>
        </div>
      </div>
      <div className="chess-log"></div>
    </div>
  );
};

export default UserPlay;
