const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
  },
  address: {
    type: String,
  },
  photo: {
    type: [String],
  },
  description: {
    type: String,
  },
  perks: {
    type: [String],
  },
  extraInfo: {
    type: String,
  },
  checkIn: {
    type: Number,
  },
  checkOut: {
    Number,
  },
  maxGuests: {
    type: Number,
  },
});

module.exports = mongoose.model("Place", PlaceSchema);
