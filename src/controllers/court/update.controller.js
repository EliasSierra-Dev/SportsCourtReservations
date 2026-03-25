const Court = require("../../models/courtSchema");
const AppError = require('../../utils/AppError')

async function updateCourt(req, res, next) {
  const { id } = req.params;
  const { name, sport, location, pricePerHour, available, description } = req.body;

  try {
    let existCourt = await Court.findById(id);

    if (!existCourt) {
        console.log(existCourt);
      return res.status(400).json({
        msg: "Not data found",
      });
    }

    existCourt = await Court.findOneAndUpdate({ _id: id },
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
      { returnDocument: 'after' },
    );
    res.status(200).json({existCourt})
 
  } catch (error) {
    next(new AppError("error en el servidor", 500));
  }
}

module.exports = updateCourt;
