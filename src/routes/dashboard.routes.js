

const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const dashboard = require('../controllers/dashboard/dashboard.controller');
const generateReport = require('../controllers/GenerateReport/generateReport.controller');


const ruta = express.Router();


ruta.get('/dashboard', verifyToken, verifyRole('admin'), dashboard);
ruta.post("/dashboard/report", verifyToken, verifyRole("admin"), generateReport);





module.exports = ruta;