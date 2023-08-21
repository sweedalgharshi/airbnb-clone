const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  place: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Place",
  },

  checkIn: {
    type: Date,
    required: true,
  },

  checkOut: {
    type: Date,
    required: true,
  },

  numberOfGuests: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
