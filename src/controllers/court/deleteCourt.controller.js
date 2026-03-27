const court = require("../../models/courtSchema");
const deleteCourtServices = require("../../services/deleteCourt.Service");

async function deleteCourte(req, res, next) {
  const { id } = req.params;

  try {
    const court = await deleteCourtServices(id);

    res.status(200).json({
      status: "success",
      msg: "Court deleted successfully",
      court,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = deleteCourte;
