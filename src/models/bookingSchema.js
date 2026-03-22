const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    court: { type: mongoose.Schema.Types.ObjectId, ref: "Court" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: Date,
    startTime: String,
    endTime: String,
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
