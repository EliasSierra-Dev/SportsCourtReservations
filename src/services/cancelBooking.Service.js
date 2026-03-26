
const Booking = require('../models/bookingSchema');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');

async function cancelBookingService(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid id", 400)
  }

  const existBooking = await Booking.findById(id)

  if (!existBooking) {
    throw new AppError("Not found", 404)
  }

  if (["cancelled", "completed"].includes(existBooking.status)) {
    throw new AppError("Reservation is already cancelled or completed", 400)
  }

  if (existBooking.user.toString() !== userId) {
    throw new AppError("You are not authorized to cancel this reservation", 403)
  }

  const booking = await Booking.findByIdAndUpdate(
    id,
    { $set: { status: "cancelled" } },
    { new: true, select: "status date startTime endTime" }
  )

  return booking
}


module.exports = cancelBookingService;