const express = require('express');
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");
const createBooking = require('../controllers/booking/booking.controller');
const cancelBooking = require('../controllers/booking/cancel.booking.controller');
const  validate  = require('../middlewares/validate');
const vaidationsBooking = require('../validators/validationsBooking');
const getBooking = require('../controllers/booking/getBookings.controller');

const ruta = express.Router();

ruta.post('/create/:id', verifyToken, verifyRole('admin', 'user'),validate(vaidationsBooking), createBooking);
ruta.post('/cancelBooking/:id', verifyToken, verifyRole('admin', 'user'), cancelBooking);
ruta.get('/booking', verifyToken, verifyRole('admin', 'user'), getBooking);


module.exports = ruta;