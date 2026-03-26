

const createCourtService = require("../../services/court.service");


async function registerCourt(req, res, next) {
 
try {
  const newCourt = await createCourtService(req.body)

   
    res.status(201).json({
      status: 'success',
      msg: "court successfully registered",
      court: {
        name: newCourt.name,
        sport: newCourt.sport,
        location: newCourt.location,
        pricePerHour: newCourt.pricePerHour,
        available: newCourt.available,
        isActive: newCourt.isActive,
        schedule: newCourt.schedule,
        description: newCourt.description,
      },
    });
} catch (error) {
  next (error)
  
}
    
}

module.exports = registerCourt;