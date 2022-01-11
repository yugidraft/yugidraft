// Requirements
const express = require('express')
const app = express();

var http = require('http').createServer(app);
var io = require("socket.io")(http);
require("dotenv").config();
const uuid = require("uuid");
var Card = require("./models/card.js");
const Game = require('./utils/helpers.js');
app.use(express.urlencoded({ extended: true })) // Handling form data
app.use(express.json()) // Handling JSON data
app.use(express.static("public"));

// const helmet = require('helmet') // Security and HTTP header middleware
// const cors = require('cors') // Handling CORS for accessible APIs
// const morgan = require('morgan') // Request logging
// const compression = require('compression') // GZIP middleware for compressing responses

// Database connection
const mongoose = require('mongoose')
const DB_URI = process.env.TEST_URI || //'mongodb://localhost:27017/test'
// const PROD_URI = process.env.MONGO_URI

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));


app.get("/", function (req, res) {
  res.sendfile(__dirname + "/index.html");
});

// Constants
const PORT = 8081;

app.listen(process.env.PORT || PORT);
console.log("Server up and running!");

module.exports = app;
//
// // // Middleware
// app.use(morgan('common'))
// app.use(helmet())
// app.use(cors({ origin: '*' }))

// app.use(compression())
// app.use((req, res, next) => {
//   res.set({
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*'
//   })
//   next()
// })

