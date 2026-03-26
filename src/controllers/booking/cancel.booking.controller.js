const cancelBookingService = require('../../services/cancelBooking.Service');


async function cancelBooking(req, res, next) {
  try {
    const booking = await cancelBookingService(req.params.id, req.user.id)

    res.status(200).json({
      status: 'success',
      booking
    })
  } catch (error) {
    next(error)
  }
}

module.exports = cancelBooking;