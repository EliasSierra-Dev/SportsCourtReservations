const createBookingService = require("../../services/booking.service");


async function createBooking(req, res, next) {
  const { id } = req.params;
  const { date } = req.query;
  const { startTime, endTime } = req.body;

  try {
    const booking = await createBookingService({ 
      userId: req.user.id, 
      courtId: id, 
      date, 
      startTime, 
      endTime 
    });

    res.status(201).json({
      status: "success",
      msg: "Reservation successfully completed",
      booking: {
        user: booking.user.firstName,
        court: booking.court.name,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
      },
    });
  } catch (error) {
    next(error) // ← así el error del servicio llega tal cual
  }
}

module.exports = createBooking;