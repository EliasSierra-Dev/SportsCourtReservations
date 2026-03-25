const court = require("../../models/courtSchema");

async function deleteCourte(req, res) {
  const { id } = req.params;

  try {
    let existCourt = await court.findById(id);
    if (!existCourt) {
      return res.status(404).json({ msg: "Not data found" });
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

    res.status(200).json({ courtUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
}

module.exports = deleteCourte;
