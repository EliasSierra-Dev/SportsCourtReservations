const express = require('express');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// 🔧 Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Rutas
app.use('/api/auth', require('./routes/register.routes')); // 🔥 aquí está el fix
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/courts', require('./routes/court.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

// 🚨 Ruta no encontrada (404)
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found',
  });
});

// ❌ Middleware de errores (SIEMPRE DE ÚLTIMO)
app.use(errorHandler);

module.exports = app;