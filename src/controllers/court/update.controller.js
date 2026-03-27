
const updateCourtServices = require("../../services/updateCourt.service");


async function updateCourt(req, res, next) {
  const { id } = req.params;
  
  try {

    const updateCourtController = await updateCourtServices(id);

    res.status(200).json({
      status: 'success',
      msg: 'Update court',
      updateCourtController
    })
    
 
  } catch (error) {
    next(error);
  }
}

module.exports = updateCourt;
