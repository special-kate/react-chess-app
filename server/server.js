const http = require("http");
require("rootpath")();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");
const { v4: uuidV4 } = require("uuid");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: "*", // allow connection from any origin
});

const rooms = new Map();

// io.connection
io.on("connection", (socket) => {
  // socket refers to the client socket that just got connected.
  // each socket is assigned an id
  console.log(socket.id, "connected");

  socket.on("username", (username) => {
    console.log("username:", username);
    socket.data.username = username;
  });

  socket.on("createRoom", async (callback) => {
    // callback here refers to the callback function from the client passed as data

    const room = Array.from(rooms.values()).find((item) =>
      item.players.some((each) => each.username === socket.data?.username)
    );

    if (room) {
      console.log(rooms, room);
      return;
    }

    const roomId = uuidV4(); // <- 1 create a new uuid
    await socket.join(roomId); // <- 2 make creating user join the room

    // set roomId as a key and roomData including players as value in the map
    rooms.set(roomId, {
      // <- 3
      roomId,
      players: [{ id: socket.id, username: socket.data?.username }],
    });
    // returns Map(1){'2b5b51a9-707b-42d6-9da8-dc19f863c0d0' => [{id: 'socketid', username: 'username1'}]}
    console.log(socket.data?.username, "created room ---", roomId);

    callback(roomId); // <- 4 respond with roomId to client by calling the callback function from the client
  });

  socket.on("joinRoom", async (args, callback) => {
    // check if room exists and has a player waiting
    console.log("join emits");

    const room = Array.from(rooms.values()).find(
      (item) => item.players && item.players.length === 1
    );

    let error, message;

    if (!room) {
      // if room does not exist
      console.log("empty", rooms);
      error = true;
      message = "room does not exist";
    }

    if (error) {
      // if there's an error, check if the client passed a callback,
      // call the callback (if it exists) with an error object and exit or
      // just exit if the callback is not given

      if (callback) {
        // if user passed a callback, call it with an error payload
        callback({
          error,
          message,
        });
      }

      return; // exit
    }

    console.log("room here", room.players);

    await socket.join(room.roomId); // make the joining client join the room

    // add the joining user's data to the list of players in the room
    const roomUpdate = {
      ...room,
      players: [...room.players, { id: socket.id, username: args.user }],
    };

    rooms.set(room.roomId, roomUpdate);
    console.log("room, roomupdate", room, roomUpdate);
    callback(roomUpdate); // respond to the client with the room details.

    // emit an 'opponentJoined' event to the room to tell the other player that an opponent has joined
    socket.to(room.roomId).emit("opponentJoined", roomUpdate);
  });

  socket.on("move", (data) => {
    // emit to all sockets in the room except the emitting socket.
    socket.to(data.room).emit("move", data.move);
  });

  socket.on("disconnect", () => {
    const gameRooms = Array.from(rooms.values()); // <- 1

    gameRooms.forEach((room) => {
      // <- 2
      const userInRoom = room.players.find((player) => player.id === socket.id); // <- 3

      if (userInRoom) {
        if (room.players.length < 2) {
          // if there's only 1 player in the room, close it and exit.
          rooms.delete(room.roomId);
          return;
        }

        socket.to(room.roomId).emit("playerDisconnected", userInRoom); // <- 4
      }
    });
  });

  socket.on("closeRoom", async (data) => {
    socket.to(data.roomId).emit("closeRoom", data); // <- 1 inform others in the room that the room is closing

    const clientSockets = await io.in(data.roomId).fetchSockets(); // <- 2 get all sockets in a room

    const gameRooms = Array.from(rooms.values()); // <- 1

    // loop over each socket client
    clientSockets.forEach((s) => {
      {
        gameRooms.forEach((room) => {
          // <- 2
          const userInRoom = room.players.find(
            (player) => player.id === socket.id
          ); // <- 3

          if (userInRoom) {
            if (room.players.length < 2) {
              // if there's only 1 player in the room, close it and exit.
              rooms.delete(room.roomId);
              return;
            }
            console.log("disconnecting");
            socket.to(room.roomId).emit("playerDisconnected", userInRoom); // <- 4
          }
        });

        s.leave(data.roomId);
      } // <- 3 and make them leave the room on socket.io
    });

    rooms.delete(data.roomId); // <- 4 delete room from rooms map
  });
});

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// api routes
app.use("/accounts", require("./accounts/accounts.controller"));

// swagger docs route
app.use("/api-docs", require("_helpers/swagger"));

// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;

server.listen(port, () => console.log("Server listening on port " + port));
