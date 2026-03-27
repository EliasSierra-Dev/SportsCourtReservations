const AppError = require("../utils/AppError");
const Court = require("../models/courtSchema");

async function updateCourtServices(id, body) {
  const { name, sport, location, pricePerHour, available, description } =
    body;
  let existCourt = await Court.findById(id);

  if (!existCourt) {
    throw new AppError("Not data found", 400);
  }

  existCourt = await Court.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: name,
        sport: sport,
        location: location,
        pricePerHour: pricePerHour,
        available: available,
        description: description,
      },
    },
    { returnDocument: "after" },
  );
  return existCourt;
}

module.exports = updateCourtServices;
