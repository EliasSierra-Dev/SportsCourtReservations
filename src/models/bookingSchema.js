const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    court: { type: mongoose.Schema.Types.ObjectId, ref: "Court" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: Date,
    startTime: String,
    endTime: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
