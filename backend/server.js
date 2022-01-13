const mongoose = require("mongoose");
const cors = require("cors");
var app = require('express')();
const bodyParser = require("body-parser");
app.use(cors());
// const http = require("http");
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const router = require("./router");
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

// App
app.use("/", router);

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
var rooms = {};

app.use(bodyParser.json());
var MAX_PLAYERS = 8

// let interval;

io.on("connection", (socket) => {
  console.log("New client connected, ", socket.id);
  socket.emit("connected", socket.id);
  // if (interval) {
  //   clearInterval(interval);
  // }
  // interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected, ", socket.id);
    socket.emit("disconnected", socket.id);

  });
});

// const getApiAndEmit = (socket) => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };

// io.on("connection", function (socket) {
//   socket.on("join room", function ({roomId, myName}) {
//     socket.roomID = roomId
//     console.log('joined room!', socket.roomId, 'socket.id: ', socket.id);

//     // join the room
//     socket.join(roomId);

//     // let everyone know that a new player has connected
//     io.to(socket.roomId).emit('user connected', {
//       players: rooms[socket.roomId].players,
//     });

//     if (rooms[socket.roomId].players.length < MAX_PLAYERS) {
//       rooms[socket.roomId].players.push({ id: socket.id, name: myName || "NEW USER" });
//     }

//     io.to(socket.roomId).emit('new connection', {
//       players: rooms[socket.roomId].players,
//       submittedCards: rooms[socket.roomId].submittedCards,
//       socketId: socket.id,
//     });

//     io.to(socket.roomId).emit('joined a room', roomId);
//     })
// })
    // app.get('/api/getDeck', async function (req, res) {
    // try {
    //     var uniques = Card.distinct( "sets.set_name", function(error, names)
    //         return res.send(names);
    // } catch (err) {
    //     console.error(err);
    //     return res
    //     .status(500)
    //     .send(
    //         'Error: There was an issue retrieving  decks...',
    //         err.message
    //         );
    //     }
    // });

// // Middleware
// app.use(morgan('common'))
// app.use(helmet())
// // app.use(cors({ origin: '*' }))
// app.use(express.urlencoded({ extended: true })); // Handling form data
// app.use(express.json()); // Handling JSON data
// // app.use(compression())
// app.use((req, res, next) => {
//   res.set({
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*'
//   })
//   next()
// })

http.listen(3001, function () {
  console.log(`listening on port 3001`);
});

module.exports.rooms = rooms;
