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

require('dotenv').config()


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

var rooms = { roomId: "3zauu" };

app.use(bodyParser.json());
var MAX_PLAYERS = 8



http.listen(process.env.PORT, function () {
  console.log(`listening on port $process.env.PORT`);
});

module.exports.rooms = rooms;
