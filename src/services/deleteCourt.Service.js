const court = require('../models/courtSchema');
const AppError = require('../utils/AppError');

async function deleteCourtServices(id) {
    


let existCourt = await court.findById(id);
    if (!existCourt) {
      throw new AppError('Not data found', 400);
    }
    const courtUpdate = await court.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
          available: false,
          "schedule.$[].isBooked": true, // actualiza todos los slots del array
        },
      },
      { returnDocument: "after" },
    );

    return courtUpdate;

}
    module.exports = deleteCourtServices;