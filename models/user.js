const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, required: true, minlength: 1 },
  deck: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
})

module.exports = mongoose.model('User', UserSchema)