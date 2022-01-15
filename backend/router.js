const express = require("express");
const server = require("./server");
const User = require("./models/user");
const Card = require("./models/card");
const mongoose = require("mongoose");
const Deck = require("./models/deck");
const { getDeck, getPublicDecks } = require("./models/deck");
mongoose.Promise = global.Promise;
const router = express.Router();

router.post("/api/checkAvailableRooms", function (req, res) {
  if (Object.keys(server.rooms).includes(req.body)) {
    return res.status(500).send("game exists");
  }

  return res.end();
});

router.post("/api/getPublicDecks", async function (req, res) {
  const temp = "";
  var decks = [
    {
      isPublic: true,
      hasSFWCards: false,
      hasNSFWCards: false,
      blackList: [],
      name: "",
      approved: true,
      isNSFW: false,
    },
  ];

  const allPublicDecks = await Card.distinct("sets.set_name").lean().exec();
  console.log(decks[0]);
  console.log("allPublicDecks ", allPublicDecks.length);
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
  return res.status(200).send(decks);
});

router.post("/api/getInitialCards", async function (req, res) {
  console.log("body is, ", req.body);
  const deckName = "2013 Collectible Tins Wave 1";

  var cards = [];

  tempCards = await Card.find({ "sets.set_name": "Absolute Powerforce" }).then(
    (results) => {
      var length = results.length;
      for (i = 0; i < length; i += 1) {
        cards.push(results[i]);
      }
    }
  );
  console.log(cards[0]);
  console.log(cards.length);
  return res.json(cards);
});

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
    const deckExists = await Deck.find({ name: "deckName" });
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
  var uniques = await Card.distinct("sets.set_name").lean().exec();

  limited.push(uniques[4]);

  for (let i = 0; i < limited.length; i += 1) {
    console.log(limited.length, i);
    console.log(deck.length);

    const currentSet = await Card.find({ "sets.set_name": limited[i] });
    deck.push(currentSet);
    // console.log(deck);
  }
  return res.json(deck);
});

module.exports = router;
