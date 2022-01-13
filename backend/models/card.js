const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CardSchema = new Schema({
  name: { type: String, required: true, minlength: 1 },
  type: { type: String, required: true },
  desc: { type: String },
  atk: { type: Number },
  def: { type: Number},
  level: { type: Number },
  race: { type: String },
  attribute: { type: String },
  archetype: { type: String },
  img: { type: String },
  sets: [{
    set_name: { type: String } ,
    set_code: { type: String } ,
    set_rarity: { type: String },
    set_rarity_code: { type: String }
  }],
})

// async function getDeck(deckName) {
//   try {
//     const deck = await Card.find({ "sets.set_name": deckName });
//     return deck;
//   } catch (err) {
//     console.error(
//       "There was an issue trying to access this deck: ",
//       err.message
//     );
//   }
// }

// module.exports.getDeck = getDeck;
module.exports = mongoose.model('Card', CardSchema)