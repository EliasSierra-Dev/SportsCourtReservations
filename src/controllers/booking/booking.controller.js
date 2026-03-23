const Booking = require("../../models/bookingSchema");
const Court = require("../../models/courtSchema");

async function createBooking(req, res) {
  const { id } = req.params;
  const { date } = req.query;
  const { startTime, endTime } = req.body;

  try {
    let court = await Court.findById(id);

    if (!court) {
      return res.status(404).json({ msg: "the court does not exist" });
    }

    let existBooking = await Booking.findOne({
      court: court,
      date: date,
      startTime: startTime,
      status: 'confirmed'
    });

    if (existBooking) {
      return res.status(400).json({ msg: "there is already a reservation" });
    }

    const availableSlots = court.schedule.filter((slot) => {
      return (
        slot.date.toISOString().split("T")[0] === date &&
        slot.isBooked === false
      );
    });

    if (availableSlots.length === 0) {
      return res.status(400).json({ msg: "The court is unavailabl" });
    }

    const booking = new Booking({
      user: req.user.id,
      court: court.id,
      date,
      startTime,
      endTime,
    });

    await booking.save();

    const slot = court.schedule.find(
      (slot) => slot.startTime === startTime && slot.endTime === endTime,
    );
    slot.isBooked = true;
    await court.save();

    await booking.populate("user");
    await booking.populate("court");
    res.status(201).json({
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
    res.status(500).json({
      err: error.message,
    });
  }
}

module.exports = createBooking;
