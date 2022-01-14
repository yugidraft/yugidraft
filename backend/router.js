
const express = require("express");
const server = require("./server");
const User = require("./models/user");
const Card = require("./models/card");
const mongoose = require("mongoose");
const Deck = require("./models/deck");
const { getDeck, getPublicDecks } = require("./models/deck");
mongoose.Promise = global.Promise;
const router = express.Router();

// router.get('/', async function (req, res) {
//     return res.send("Hello World!");

// });

router.post("/api/checkAvailableRooms", function (req, res) {
  if (Object.keys(server.rooms).includes(req.body)) {
    return res.status(500).send("game exists");
  }

  return res.end();
});

// router.get("/api/getPublicDecks", async function (req, res) {
//   try {
//     const allPublicDecks = await getPublicDecks();
//     console.log(allPublicDecks.length);
//     return res.status(200).send(allPublicDecks);
//   } catch (err) {
//     return res.status(500).send(
//         "Error: There was an issue retrieving public decks...",
//         err.message
//       );
//   }
// });

router.post("/api/getPublicDecks", async function (req, res) {
  const temp = ''
  var decks = [{
    isPublic: true,
    hasSFWCards: false,
    hasNSFWCards: false,
    blackList: [],
    name: '',
    approved: true,
    isNSFW: false
  }];
  // const temp = []

  // const returnedDeck = await Deck.find({ name: "Dark Neostorm" });
  // console.log(returnedDeck[0].name);
  //   }];
  // const DeckNames = await Deck.distinct("name").lean().exec();
  // console.log("DeckNames ", returnedDeck[0]);
  // console.log(returnedDeck[0].name);
  const allPublicDecks = await Card.distinct("sets.set_name").lean().exec();
  console.log(decks[0]);
  console.log('allPublicDecks ', allPublicDecks.length);
  for (i = 0; i < allPublicDecks.length; i += 1) {
    var deckName = allPublicDecks[i];
    // console.log(deckName.length);
    decks[i] = {
        isPublic: true,
        hasSFWCards: false,
        hasNSFWCards: false,
        blackList: [],
        name: deckName,
        approved: true,
        isNSFW: false,
    };
  }
  // Card.findOne({ "sets.set_name": allPublicDecks[0] }, function (err, cards) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     const temp = cards.sets[0].set_name;
  //     // console.log(cards.sets);
  //     console.log('name is', decks[0].name, cards.sets[0].set_name);
  //     decks[0].name = cards.sets[0].set_name;
  //     console.log(decks[0])

  //   }
  return res.status(200).send(decks);


});

router.post("/api/getInitialCards", async function (req, res) {
  // const  deckName  = req.query
  // console.log(req.body);
  console.log("body is, ", req.body);
  const deckName = '2013 Collectible Tins Wave 1';
  // console.log('params name is', req.params.name);
  // const roomId = "3zauu";

  var cards = [];
  // Promise.all(
  //   new Promise(Card.find({ "sets.set_name": deckName }).exec()
  //   .then(results => {
  //     cards = results[0].map(c => ({value: c.name}));
  //     res.send(cards);
  //   })
  //   .catch(err => {
  //     throw err;
  //   })
  // ))
  tempCards = await Card.find({ "sets.set_name": "Absolute Powerforce" }).then(results => {
    var length = results.length;
    for (i = 0; i < length; i += 1) {
      cards.push(results[i]);
    }
  })
  console.log(cards[0])
  console.log(cards.length)
  return res.json(cards);
});

  // var findCards = new Promise((resolve, reject) => {
  //   Card.find({ "sets.set_name": deckName }), function(err, cards) {
  //     if (err) {
  //       reject(err);

  //       resolve(cards);
  //     }
  //   }
  // });
  // console.log(tempCards.length);
  // // Returns a random integer from 0 to 9:
  // for (i = 0; i < tempCards.length; i += 1) {
  //     cards.push(tempCards[i]);
  // }
  // // var numberofCards = Math.floor(Math.random() * tempCards.length-1);
  // // console.log(numberofCards);
  // // for (i = 0; i < 9; i += 1) {
  // //   cards.push(tempCards[i]);
  // var allCards = {};

  // Promise.all([findCards]).then(results => {
  //   allCards = {};
  //   results[0].forEach(function(card) {
  //     allCards.push(card);
  //     console.log(allCards)
  //   });
  //   // res.status(200).send(allCards);
  // });
  // console.log(allCards);

  // console.log(
  //   "hitting getInitialCards route",
  //   server.rooms[roomId] ? server.rooms[roomId].blackCards.length : "blah"
  // );
  // if (server.rooms[roomId]) {
  //   if (server.rooms[roomId].initialCardsAreSet) {
  //     return res.end();
  //   }

  //   server.rooms[roomId].initialCardsAreSet = true;
  //   console.log("initial cards are set!");

  // try {
  //   let totalCards = [];
  //   if (deckName) {
  //     const cardsFromDeck = await getCardsFromDeck(deckName);
  //     totalCards.push(...cardsFromDeck);
    // }
    //   if (hasSFWCards) {
    //     const SFWCards = await getCardsFromDeck("safe-for-work");
    //     totalCards.push(...SFWCards);
    //   }
    //   if (hasNSFWCards) {
    //     const NSFWCards = await getCardsFromDeck("not-safe-for-work");
    //     totalCards.push(...NSFWCards);
    //   }
    // } else {
    //   // if there's no deck query param, load SFW deck by default
    //   const SFWCards = await getCardsFromDeck("safe-for-work");
    //   totalCards.push(...SFWCards);
    // }

    // const blackCards = shuffle(
    //   totalCards.filter(({ type }) => type === "black").map(({ text }) => text)
    // );
    // const whiteCards = shuffle(
    //   totalCards.filter(({ type }) => type === "white").map(({ text }) => text)
    // );

    // just send back array of text for each
    // shuffle them first
//     return res.status(200).send(totalCards);
//   } catch (err) {
//     return res
//       .status(500)
//       .send(
//         "Error: There was an issue retrieving initial cards from this deck...",
//         err.message
//       );
//   }
// });

router.get("/api/getCardsFromDeck/:name", async function (req, res) {
  const deckName = req.params.name;

  try {
    const cardsFromDeck = await getCardsFromDeck(deckName);
    return res.status(200).send(cardsFromDeck);
  } catch (err) {
    return res
      .status(500)
      .send(
        "Error: There was an issue retrieving cards from the deck...",
        err.message
      );
  }
});

router.post("/api/getDeck", async function (req, res) {
  const deckName = req.body;
  console.log(deckName);
  try {
    const deckExists = await Deck.find({name : 'deckName'});
    // console.log({ deckExists });
    if (deckExists) {
      return res.send("Deck exists!");
    } else {
      return res.status(500).send("Error: This deck doesn't exist...");
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("Error: There was an issue retrieving this deck...", err.message);
  }
});

router.get("/api/listDecks", async (req, res) => {
  var deck = [];
  var limited = [];
  console.log("inside list decks");
  var uniques = await Card.distinct("sets.set_name").lean().exec()
    // if (error) {function (error, names) {
    //   console.log(error);
    // } else {
    //   // console.log(names[5]), names[583], names[235], names[654]
      limited.push(uniques[4]);
    //   // console.log(limited)
    // }
  // });

  for (let i = 0; i < limited.length; i += 1) {
    console.log(limited.length, i);
    console.log(deck.length);

    const currentSet = await Card.find({ "sets.set_name": limited[i] });
    deck.push(currentSet);
    // console.log(deck);
  }
  return res.json(deck);

});
    //       if (err) {
  //         console.log(err);
  //       }
  //       else {
  //         decks[i].name = cards.set.set_name;
  // try {
  //   const allPublicDecks = await Card.distinct("sets.set_name")
  //   console.log(allPublicDecks[1]);
  //   for (i = 0; i < allPublicDecks.length; i+= 1) {


  // async function getPublicDecks() {

  // }
  //   // var limited = []
  //   // limited.push(allPublicDecks[5], allPublicDecks[583], allPublicDecks[235], allPublicDecks[654])
  //   // console.log(limited)
  //   return res.send(allPublicDecks);
  // } catch (err) {
  //   console.error(err);
  //   return res
  //     .status(500)
  //     .send(
  //       "Error: There was an issue retrieving public decks...",
  //       err.message
  //     );
//   // }
// router.get("/api/getDeck/:name", async (req, res) => {
//   console.log("made it in");
//   const deckName = req.params.name;
//   const search = await Card.find({ "sets.set_name": deckName })
//     .then(async (cards) => {
//       // console.log(cards);
//       return res.json(cards);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });



    // .then((cards) => {
    //   pack.push(cards);
    //   console.log(pack[i])
    //   console.log(pack.length, 'end of then')
    // })
    // .catch((err) => {
    //   console.log(err);
    // })

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

// router.post("/api/getDeck", async (req, res) => {
// console.log("inside getdeck post");
//   const deckName = req.body.name;
//   const search = await Card.find({ "sets.set_name": deckName })
//     .then(async (cards) => {
//       // console.log(cards);
//       Deck.deck.push(cards);
//       return res.json(cards);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });




module.exports = router;
