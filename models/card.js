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
    name: { type: String } ,
    code: { type: String } ,
    rarity: { type: String },
    rarity_code: { type: String }
  }],
})

module.exports = mongoose.model('Card', CardSchema)