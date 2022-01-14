
const express = require("express");
const server = require("./server");
const User = require("./models/user");
const Card = require("./models/card");
const Deck = require("./models/deck");
const { getDeck, getPublicDecks } = require("./models/deck");

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

router.get("/api/getPublicDecks", async function (req, res) {
  const temp = ''
  // var decks = [{
  //   isPublic: true,
  //   hasSFWCards: false,
  //   hasNSFWCards: false,
  //   blackList: [],
  //   name: '',
  //   approved: true,
  //   isNSFW: false
  const returnedDeck = await Deck.find({ isPublic: true });
  //   }];
  // const DeckNames = await Deck.distinct("name").lean().exec();
  console.log("DeckNames ", returnedDeck[0]);
  // const allPublicDecks = await Card.distinct("sets.set_name").lean().exec();
  // console.log(decks[0]);
  // for (i = 0; i < allPublicDecks.length; i += 1) {
  //   var deckName = allPublicDecks[i];
  //   decks[i] = {
  //       isPublic: true,
  //       hasSFWCards: false,
  //       hasNSFWCards: false,
  //       blackList: [],
  //       name: deckName,
  //       approved: true,
  //       isNSFW: false,
  //   };
  // }
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
  return res.status(200).send(returnedDeck);


});

router.post("/api/getInitialCards", async function (req, res) {
  // const { deckName, roomId } = req.body;
  // console.log(req.body);
  const deckName = "Absolute Powerforce";
  const roomId = "3zauu";

  let cards = [];

  tempCards = await Card.find({ "sets.set_name": deckName })

  for (i = 0; i < tempCards.length; i += 1) {
    cards.push(tempCards[i]);
  }
  return res.status(200).send(cards);
});
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
