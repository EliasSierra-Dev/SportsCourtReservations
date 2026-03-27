const Court = require('../../models/courtSchema');
const getCourtServices = require('../../services/getCourt.service');
const AppError = require('../../utils/AppError');

async function getCourt(req, res, next) {

  try {
    const getCourt = await getCourtServices({
      all: req.query.all,      
      isActive: req.query.isActive, 
      role: req.user.role
    })

    res.status(200).json({
      status: 'success', 
      msg: 'List Courts',
      getCourt});

    
  } catch (error) {
    next (error)

    
  }
    
  } 

module.exports = getCourt;