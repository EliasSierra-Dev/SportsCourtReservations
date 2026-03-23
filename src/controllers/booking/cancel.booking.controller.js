const Booking = require("../../models/bookingSchema");
const AppError = require("../../utils/AppError");
const mongoose = require("mongoose");

async function cancelBooking(req, res, next) {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid id" });
    }
    const existBooking = await Booking.findById(id);

    if (!existBooking) {
      return res.status(404).json({ msg: "not found" });
    }

    if (["cancelled", "completed"].includes(existBooking.status)) {
      return res
        .status(400)
        .json({ msg: "Reservation is already cancelled or completed" });
    }

    if (existBooking.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ msg: "You are not authorized to cancel this reservation " });
    }

    const cancelBooking = await Booking.findByIdAndUpdate(
      id,
      {
        $set: { status: "cancelled" },
      },
      { new: true, select: "status date startTime endTime" },
    );

    res.status(200).json(cancelBooking);
  } catch (error) {
    console.log(error);
    next(new AppError("error server", 500));
  }
}

module.exports = cancelBooking;
