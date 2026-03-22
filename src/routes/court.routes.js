const express = require('express');
const registerCourt = require('../controllers/court/court.controller');
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

const countRegister = express.Router();

countRegister.post('/courts/courtRegister',  verifyToken,  verifyRole('admin'),  registerCourt);

module.exports = countRegister;