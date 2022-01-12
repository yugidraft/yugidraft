// Requirements

const express = require("express");
const app = express();

var http = require('http').createServer(app);
var io = require("socket.io")(http);
const uuid = require("uuid");
// const helmet = require('helmet') // Security and HTTP header middleware
// const cors = require('cors') // Handling CORS for accessible APIs
// const morgan = require('morgan') // Request logging
// const compression = require('compression') // GZIP middleware for compressing responses
// require('dotenv').config()

// App
var Card = require("./models/card.js");

// Database connection
const mongoose = require("mongoose");
const DB_URI = "mongodb://localhost:27017/yugidraft";
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  console.log("Connected to DB");
});


app.use(express.static("public"));

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });

// io.on('connection', function (socket) {
//   console.log('a user has connected');
//   socket.on('disconnect', function () {
//     console.log('user disconnected');
//   });
// });
// // Middleware
// app.use(morgan('common'))
// app.use(helmet())
// app.use(cors({ origin: '*' }))
app.use(express.urlencoded({ extended: true })); // Handling form data
app.use(express.json()); // Handling JSON data
// app.use(compression())
// app.use((req, res, next) => {
//   res.set({
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*'
//   })
//   next()
// })


require('./routes/query.js')(app)

module.exports = app;