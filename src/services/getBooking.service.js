const AppError = require("../utils/AppError");
const Booking = require("../models/bookingSchema");

async function getBookingService({ role, id }) {

  if (role === "admin") {
    const admin = await Booking.find({})
      .populate("user", "firstName lastName email")
      .populate("court", "name sport location");
    if (admin.length === 0) {
      throw new AppError("no bookings found", 400);
    }
    return admin;
  }
  const user = await Booking.find({user:  id })
    .populate("user", "firstName lastName email")
    .populate("court", "name sport location");
  if (user.length === 0) {
    throw new AppError("no bookings found", 400);
  }
  return user;
}

module.exports = getBookingService;
