const dashboardServices = require("../../services/dashboard.service");


async function dashboard(req, res, next) {
  try {

    const dashboardController = await dashboardServices();
   
    res.status(200).json({
      status: 'Succes',
      msg: 'dashboard',
      dashboardController,
    });
  } catch (error) {
   
   next(error)
  }
}

module.exports = dashboard;
