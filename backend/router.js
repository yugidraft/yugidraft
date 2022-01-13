
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

router.get("/api/getPublicDecks", async function (req, res) {
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
  var pack = [];
  var limited = [];
  console.log("inside listpack");
  var uniques = await Card.distinct("sets.set_name", function (error, names) {
    if (error) {
      console.log(error);
    } else {
      // console.log(names[5])
      limited.push(names[583], names[235], names[654]);
      // console.log("about to leave first await, limited is", limited.length);
      }
  });
  // console.log('bout to go to limited')

  // Promise.all(limited.map()).then(allCards => {
  //   return res.json(allCards);
  // });
  // })
  for (let i = 0; i < limited.length; i+= 1) {
    console.log(limited.length, i);
    const currentSet = await Card.find({ "sets.set_name": limited[i] })
    pack.push(currentSet);
    console.log(pack.length);
    // .then((cards) => {
    //   pack.push(cards);
    //   console.log(pack[i])
    //   console.log(pack.length, 'end of then')
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
  }
  return res.json(pack);
});
    //   limited.forEach(async function(element) {
    // var temp = Card.find({ "sets.set_name": element })
    // .then((element) => {
    //   // console.log('in loop', element)
    //   pack.push(element);
    //   console.log('that was element')
    //   console.log('pack is ',pack.length)
    //   console.log('limited is ',limited.length)
    // return res.json(pack)
    // })
    // .catch((err) => {
    //   console.log(err)
    // });


  // console.log('length of limited is ', limited.length)
  // console.log("length of pack is ", pack.length);
  // console.log(pack);
// });

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


module.exports = router;
