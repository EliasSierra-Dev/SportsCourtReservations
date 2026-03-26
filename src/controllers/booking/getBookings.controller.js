
const getBookingService = require("../../services/getBooking.service");
const AppError = require("../../utils/AppError");

async function getBooking(req, res, next) {
  try {
    
      const getBooking = await getBookingService({ 
        role: req.user.role,
         id: req.user.id
        })

      res.status(200).json({ 
        status: 'success',
        getBooking
      })
    
  } catch (error) {
    next(error);
  }
}

module.exports = getBooking;
