const Court = require('../../models/courtSchema');

async function getCourt(req, res) {
  try {
    const { all, isActive } = req.query;

    let filter = {};

    if (all && req.user.role !== 'admin') {
  return res.status(403).json({ msg: 'Access denied' });
}
    if (!all) {
      // si no viene ?all=true, filtra por estado
      filter.isActive = isActive !== undefined  // : true
        ? isActive === 'true'
        : true; // por defecto solo activas
    }

    const courts = await Court.find(filter);

    if (courts.length === 0) {
      return res.status(404).json({ msg: 'no data found' });
    }

    res.status(200).json(courts);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

module.exports = getCourt;