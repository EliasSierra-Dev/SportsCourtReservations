const express = require('express');
const registerCourt = require('../controllers/court/court.controller');
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");
const getCourt = require('../controllers/court/getCourts.controller');
const updateCourt = require('../controllers/court/update.controller');
const deleteCourte = require('../controllers/court/deleteCourt.controller');

const ruta = express.Router();

ruta.post('/courts/courtRegister',  verifyToken,  verifyRole('admin'),  registerCourt);
ruta.get('/courts/listCourt', verifyToken,  getCourt);
ruta.put('/updateCourt/:id',  verifyToken,  verifyRole('admin'),  updateCourt);
ruta.patch('/deleteCourt/:id',  verifyToken,  verifyRole('admin',),  deleteCourte);


module.exports = ruta;
