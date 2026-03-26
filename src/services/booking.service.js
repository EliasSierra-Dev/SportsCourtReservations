const Booking = require('../models/bookingSchema');
const Court = require('../models/courtSchema');
const AppError = require('../utils/AppError')

async function createBookingService({ userId, courtId, date, startTime, endTime }) {
  
  const court = await Court.findById(courtId);

  if (!court) {
    throw new AppError("The court does not exist", 404);
  }

  if (!court.isActive) {
    throw new AppError("The court is not available", 400);
  }

  const existBooking = await Booking.findOne({
    court: courtId,
    date,
    startTime,
    status: "confirmed",
  });

  if (existBooking) {
    throw new AppError("There is already a reservation", 400);
  }

  const availableSlots = court.schedule.filter((slot) => {
    return (
      slot.date.toISOString().split("T")[0] === date &&
      slot.isBooked === false
    );
  });

  if (availableSlots.length === 0) {
    throw new AppError("The court is unavailable", 400);
  }

  const booking = new Booking({ user: userId, court: courtId, date, startTime, endTime });
  await booking.save();

  const slot = court.schedule.find(
    (slot) => slot.startTime === startTime && slot.endTime === endTime
  )
  slot.isBooked = true
  await court.save();

  await booking.populate("user");
  await booking.populate("court");

  return booking;
}

module.exports = createBookingService;