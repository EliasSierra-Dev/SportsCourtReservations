// Manejador de errores.
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  res.status(status).json({ msg: err.message });
}

module.exports = errorHandler;