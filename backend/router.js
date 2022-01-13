
const express = require("express");
const server = require("./server");
const User = require("./models/user");
const Card = require("./models/card");
const router = express.Router();

router.get('/', async function (req, res) {
    return res.send("Hello World!");

});

router.post("/api/checkAvailableRooms", function (req, res) {
  if (Object.keys(server.rooms).includes(req.body.roomName)) {
    return res.send("game exists");
  }

  return res.end();
});

router.get("/api/getPacks", async function (req, res) {
  try {
    const allPublicDecks = await Card.distinct("sets.set_name")
    // console.log(allPublicDecks[5])
    // var limited = []
    // limited.push(allPublicDecks[5], allPublicDecks[583], allPublicDecks[235], allPublicDecks[654])
    // console.log(limited)
    return res.send(allPublicDecks);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send(
        "Error: There was an issue retrieving public decks...",
        err.message
      );
  }
});

router.get("/api/getPack/:name", async (req, res) => {
  console.log("made it in");
  const packName = req.params.name;
  const search = await Card.find({ "sets.set_name": packName })
    .then(async (cards) => {
      // console.log(cards);
      return res.json(cards);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/api/listPacks", async (req, res) => {
  var pack = []
  console.log("inside listpack");
  var uniques = await Card.distinct("sets.set_name", function (error, names) {
    if (error) {
          console.log(error);
    } else {
    //   console.log(names);
        console.log(names[5])
        var limited = []
        limited.push(names[5], names[583], names[235], names[654])
        console.log(limited);
        limited.forEach(async function(element) {
          console.log('in loop', element)
          var temp = await Card.find({ "sets.set_name": element });
          pack.push(temp);
          console.log("current pack is ", temp);
        });
        }
  })
  return res.send(pack);
});

// router.post("/api/setPack/:name", async (req, res) => {
// console.log("inside setPack");
//   const packName = req.params.name;
//   const search = await Card.find({ "sets.set_name": packName })
//     .then(async (cards) => {
//       // console.log(cards);
//       User.deck.push(cards);
//       return res.json(cards);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// router.get('/express_backend', (req, res) => {
//     res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
// })

//.then(async (unique_decks) => {
//   console.log(unique_decks);
//   return res.json(unique_decks);
// })
// .catch((err) => {
//   console.log(err);
// })
module.exports = router;
