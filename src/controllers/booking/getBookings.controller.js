const Booking = require("../../models/bookingSchema");
const AppError = require("../../utils/AppError");

async function getBooking(req, res, next) {
  try {
    if (req.user.role === "admin") {
      const admin = await Booking.find({})
        .populate('user', 'firstName lastName email')
        .populate('court', 'name sport location')
      return res.status(200).json(admin)
    } else {
      const user = await Booking.find({ user: req.user.id })
        .populate('user', 'firstName lastName email')
        .populate('court', 'name sport location')
      return res.status(200).json(user)
    }
  } catch (error) {
    console.log(error);
    next(new AppError('error en el servidor', 500))
  }
}

module.exports = getBooking;