const mongoose = require("mongoose");
const cors = require("cors");
var app = require('express')();
const bodyParser = require("body-parser");
app.use(
  cors({
    origin: "*",
  })
);
// const http = require("http");
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const router = require("./router")
// const { Server } = require("socket.io");
// const io = new Server(server);
// const app = require("express")();
// const server = require("http").createServer(app);
// var io = require("socket.io")(server)
// const uuid = require("uuid");
// const helmet = require('helmet') // Security and HTTP header middleware
// const cors = require('cors') // Handling CORS for accessible APIs
// const morgan = require('morgan') // Request logging
// const compression = require('compression') // GZIP middleware for compressing responses
// require('dotenv').config()
//
//   {
//   "origin": "*",
//   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//   "preflightContinue": false,
//   "optionsSuccessStatus": 204
//   }
// )
// App

// Database connection
const DB_URI = "mongodb://localhost:27017/yugidraft";
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  console.log("Connected to DB");
});

app.use("/", router);

var rooms = {};

app.use(bodyParser.json());
var MAX_PLAYERS = 8

// let interval;

/// when a user hits the /game path, start the websocket connection
io.on("connection", function (socket) {
  socket.on("join room", function ({roomId, myName}) {
    // If there's more than MAX_PLAYERS, then just disconnect any others
    // just kidding, this causes an infinite loops since we refresh the page when someone disconnects
    // this may not be necessary to handle?
    // if (rooms[roomId] && rooms[roomId].players.length === MAX_PLAYERS) {
    //   console.log('Disconnected...');
    //   // socket.disconnect();
    //   return;
    // }

    // if the room doesnt already exist, add to the rooms object
    if (!rooms[roomId]) {
      rooms[roomId] = new Game();
    }

    // Add roomId to socket object
    socket.roomId = roomId;

    console.log('joined room!', socket.roomId, 'socket.id: ', socket.id);

    // join the room
    socket.join(roomId);

    // let everyone know that a new player has connected
    io.to(socket.roomId).emit('user connected', {
      players: rooms[socket.roomId].players,
    });

    if (rooms[socket.roomId].players.length < MAX_PLAYERS) {
      rooms[socket.roomId].players.push({ id: socket.id, name: myName || "NEW USER" });
    }

    io.to(socket.roomId).emit('new connection', {
      whiteCards: rooms[socket.roomId].whiteCards,
      blackCards: rooms[socket.roomId].blackCards,
      players: rooms[socket.roomId].players,
      submittedCards: rooms[socket.roomId].submittedCards,
      socketId: socket.id,
    });

    io.to(socket.roomId).emit('joined a room', roomId);
  });

  socket.on('set game as private', function () {
    rooms[socket.roomId].isPrivate = true;

    console.log('set game as private, rooms: ', rooms);
  });

  // first player to join game hits the getInitialCards endpoint and sets the initial cards for the game
  socket.on('set initialCards for game', function ({
    whiteCards: newWhiteCards,
    blackCards: newBlackCards,
  }) {
    rooms[socket.roomId].whiteCards = newWhiteCards;
    rooms[socket.roomId].blackCards = newBlackCards;

    io.to(socket.roomId).emit('get initialCards for game', {
      whiteCards: rooms[socket.roomId].whiteCards,
      blackCards: rooms[socket.roomId].blackCards,
    });
  });

  // update the whiteCards on the server
  socket.on('update whiteCards', function ({
    whiteCards: newWhiteCards,
    players: newPlayers,
  }) {
    rooms[socket.roomId].whiteCards = newWhiteCards;
    rooms[socket.roomId].players = newPlayers;
    io.to(socket.roomId).emit('update players', rooms[socket.roomId].players);
  });

  // update the submittedCards when someone discards a card
  socket.on('update submittedCards', function (passedInCard) {
    // remove passedInCard from submittedCards
    const passedInCardIndex = rooms[socket.roomId].submittedCards.findIndex(
      (card) => card.text === passedInCard.text
    );
    rooms[socket.roomId].submittedCards.splice(passedInCardIndex, 1);

    // let EVERYONE know including the client that triggered this
    io.to(socket.roomId).emit(
      'update submittedCards',
      rooms[socket.roomId].submittedCards
    );
  });

  // update the whiteCards on the server
  socket.on('submitted a card', function ({
    socketId,
    passedInCard,
    newMyCards,
  }) {
    // 2020-06-30T14:08:31.086551+00:00 app[web.1]: /app/server.js:109
    // 2020-06-30T14:08:31.086569+00:00 app[web.1]:     rooms[socket.roomId].submittedCards.push(passedInCard);
    // 2020-06-30T14:08:31.086570+00:00 app[web.1]:                          ^
    // 2020-06-30T14:08:31.086571+00:00 app[web.1]:
    // 2020-06-30T14:08:31.086571+00:00 app[web.1]: TypeError: Cannot read property 'submittedCards' of undefined
    if (!rooms[socket.roomId]) {
      console.log(
        'Warning: rooms[socket.roomId] is undefined. ',
        `socket.roomId: ${socket.roomId}`,
        `typeof socket.roomId ${typeof socket.roomId}`,
        'rooms: ',
        Object.keys(rooms)
      );
    }
    rooms[socket.roomId].submittedCards.push(passedInCard);

    // randomize the submittedCards when a new one is submitted
    rooms[socket.roomId].submittedCards = shuffle(
      rooms[socket.roomId].submittedCards
    );

    // find current player from players and update whiteCards property to be newMyCards
    const playerIndex = rooms[socket.roomId].players.findIndex(
      (player) => player.id === socketId
    );

    // prevent user error: TypeError: Cannot set property 'whiteCards' of undefined
    if (rooms[socket.roomId].players[playerIndex]) {
      rooms[socket.roomId].players[playerIndex].whiteCards = newMyCards;
    } else {
      console.log(
        "Warning: Player that submitted card doesn't exist. players: ",
        rooms[socket.roomId].players,
        'socketId: ',
        socketId,
        ' index: ',
        playerIndex
      );
    }

    // let EVERYONE know including the client that triggered this
    io.to(socket.roomId).emit('submitted a card', {
      submittedCards: rooms[socket.roomId].submittedCards,
      players: rooms[socket.roomId].players,
      passedInCard,
    });
  });

  // update the blackCards on the server
  socket.on('update blackCards', function (newBlackCards) {
    rooms[socket.roomId].blackCards = newBlackCards;
  });

  // when someone drops a white card into their deck
  socket.on('dropped in my cards', function ({passedInCard, socketId}) {
    const indexOfPassedInCard = rooms[socket.roomId].whiteCards.findIndex(
      (whiteCard) => whiteCard === passedInCard.text
    );
    rooms[socket.roomId].whiteCards.splice(indexOfPassedInCard, 1);

    // update player whiteCards property
    const newPlayers = rooms[socket.roomId].players.map((player) => {
      if (player.id === socketId) {
        player.whiteCards = [
          ...(player.whiteCards ? player.whiteCards : []),
          passedInCard,
        ];
      }
      return player;
    });
    rooms[socket.roomId].players = newPlayers;

    io.to(socket.roomId).emit('dropped in my cards', {
      players: rooms[socket.roomId].players,
      whiteCards: rooms[socket.roomId].whiteCards,
    });
  });

  // when someone drops a black card into a player drop
  socket.on('dropped in player drop', function ({
    players: newPlayers,
    blackCards: newBlackCards,
  }) {
    rooms[socket.roomId].players = newPlayers;
    rooms[socket.roomId].blackCards = newBlackCards;
    console.log({blackCards: rooms[socket.roomId].blackCards.length});
    this.broadcast.to(socket.roomId).emit('dropped in player drop', {
      players: rooms[socket.roomId].players,
      blackCards: rooms[socket.roomId].blackCards,
    });
  });

  // get the mouse coordinates from the client
  socket.on('dragged card', function ({type, text, x, y}) {
    // send the coordinates to everyone but client that sent it
    this.broadcast.to(socket.roomId).emit('dragged card', {type, text, x, y});
  });

  // get the mouse coordinates from the client
  socket.on('let go card', function ({type, text}) {
    // send the coordinates to everyone but client that sent it
    this.broadcast.to(socket.roomId).emit('let go card', {type, text});
  });

  socket.on('card is flipped', function ({isFlipped, text}) {
    this.broadcast.to(socket.roomId).emit('card is flipped', {isFlipped, text});
  });

  // when someone changes their player name,
  // update players name property and emit back
  socket.on('name change', function ({id, name}) {
    if (!socket.roomId && !rooms[socket.roomId]) {
      return;
    }
    if (
      rooms[socket.roomId].players.length <= MAX_PLAYERS &&
      rooms[socket.roomId].players.find((player) => player.id === id)
    ) {
      rooms[socket.roomId].players.find(
        (player) => player.id === id
      ).name = name;
      io.to(socket.roomId).emit('name change', rooms[socket.roomId].players);
    }
  });

  socket.on('name submit', function ({players: newPlayers, myName, id}) {
    if (!socket.roomId && !rooms[socket.roomId]) {
      return;
    }
    const matchedPlayerThatLeft = rooms[socket.roomId].playersThatLeft.find(
      (player) => player.name === myName
    );
    if (myName !== 'NEW USER' && matchedPlayerThatLeft) {
      const playerIndex = rooms[socket.roomId].players.findIndex(
        (player) => player.id === id
      );
      rooms[socket.roomId].players[playerIndex] = matchedPlayerThatLeft;
      rooms[socket.roomId].players[playerIndex].id = id;
      io.to(socket.roomId).emit('player rejoins', rooms[socket.roomId].players);
    } else {
      rooms[socket.roomId].players = newPlayers;
      io.to(socket.roomId).emit('update players', rooms[socket.roomId].players);

      // grab (and remove) seven white cards when showNamePopup goes away
      const sevenWhiteCards = rooms[socket.roomId].whiteCards.splice(0, 7);

      // modify the seven white cards so that they have the right shape
      const modifiedSevenWhiteCards = sevenWhiteCards.map((text, index) => ({
        bgColor: '#fff',
        color: '#000',
        id: index,
        isFlipped: false,
        text,
        type: 'whiteCard',
      }));

      // add seven white cards to a users deck once they submit a name
      const playerThatJoined = rooms[socket.roomId].players.find(
        (player) => player.id === id
      );
      playerThatJoined.whiteCards = modifiedSevenWhiteCards;

      // emit update back to clients
      io.to(socket.roomId).emit('draw seven white cards update', {
        players: rooms[socket.roomId].players,
        whiteCards: rooms[socket.roomId].whiteCards,
        sevenWhiteCards: modifiedSevenWhiteCards,
        socketId: id,
      });
    }
  });

  socket.on('sent message to chat', function ({msg, from}) {
    this.broadcast
      .to(socket.roomId)
      .emit('receive message from chat', {msg, from});
  });

  // when a specific player disconnects
  socket.on('disconnect', function () {
    // If everyone leaves, destroy the room
    if (rooms[socket.roomId] && rooms[socket.roomId].players.length <= 1) {
      clearTimeout(rooms[socket.roomId].timer);
      delete rooms[socket.roomId];
      return;
    }

    // if the room doesn't exist anymore, because the server restarted, just bail.
    if (!rooms[socket.roomId]) {
      return;
    }

    // reset the timer before you start it again
    if (rooms[socket.roomId] && rooms[socket.roomId].timer) {
      clearTimeout(rooms[socket.roomId].timer);
    }

    if (rooms[socket.roomId] && rooms[socket.roomId].playersThatLeft) {
      rooms[socket.roomId].timer = setTimeout(() => {
        rooms[socket.roomId].playersThatLeft.length = 0;
        console.log(
          'cleared playersThatLeft ',
          rooms[socket.roomId].playersThatLeft
        );
      }, 600000);
    }

    const playerThatLeft = rooms[socket.roomId].players.find(
      (user) => user.id === socket.id
    );

    if (playerThatLeft) {
      // find the player that lefts index by the name
      const playerThatLeftIndex = rooms[
        socket.roomId
      ].playersThatLeft.findIndex((player) => {
        return player.id === playerThatLeft.id;
      });

      // if the player that left already left before, remove them from playersThatLeft
      if (
        rooms[socket.roomId].playersThatLeft.find(
          (player) => player.id === playerThatLeft.id
        )
      ) {
        rooms[socket.roomId].playersThatLeft.splice(playerThatLeftIndex, 1);
      }

      // track the new player that left
      rooms[socket.roomId].playersThatLeft.push(playerThatLeft);

      // update global players variable
      rooms[socket.roomId].players.splice(
        rooms[socket.roomId].players.findIndex((user) => user.id === socket.id),
        1
      );
    }

    io.to(socket.roomId).emit(
      'user disconnected',
      rooms[socket.roomId].players
    );
    console.log('user disconnected: ', socket.id);

    if (
      rooms[socket.roomId] &&
      rooms[socket.roomId].players &&
      rooms[socket.roomId].playersThatLeft
    ) {
      console.log({
        players: rooms[socket.roomId].players,
        playersThatLeft: rooms[socket.roomId].playersThatLeft,
      });
    }
  });
});
http.listen(3001, function () {
  console.log(`listening on port 3001`);
});

module.exports.rooms = rooms;
