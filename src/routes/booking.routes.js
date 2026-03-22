const express = require('express');
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");
const createBooking = require('../controllers/booking/booking.controller');

const ruta = express.Router();

ruta.post('/booking/:id', verifyToken, verifyRole('admin', 'user'), createBooking);

module.exports = ruta;