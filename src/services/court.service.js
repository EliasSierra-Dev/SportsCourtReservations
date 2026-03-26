const AppError = require('../utils/AppError');
const Court = require('../models/courtSchema')


async function createCourtService({
  name,
  sport,
  location,
  pricePerHour,
  available,
  isActive,
  schedule,
  description,
}) {
        const court = await Court.findOne({ name: name });

  if (court) {
    throw new AppError( 'the court already exists' , 400)
 
  }
  const newCourt = new Court({
    name,
    sport,
    location,
    pricePerHour,
    available,
    isActive,
    schedule,
    description,
  });

  await newCourt.save();
  return newCourt;
    
  
}

module.exports = createCourtService;
