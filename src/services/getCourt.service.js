const Court = require('../models/courtSchema');
const AppError = require('../utils/AppError')


async function getCourtServices({all, isActive, role} ) {
   let filter = {};
   

    if (all && role !== 'admin') {
        throw new AppError(' Access denied', 400)
}
    if (!all) {
      // si no viene ?all=true, filtra por estado
      filter.isActive = isActive !== undefined  // : true
        ? isActive === 'true'
        : true; // por defecto solo activas
    }

    const courts = await Court.find(filter);

    if (courts.length === 0) {
        throw new AppError( 'no data found', 400)

    } 

    return courts;
}


module.exports = getCourtServices;