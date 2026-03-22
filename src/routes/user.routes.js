const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const updatePassword = require('../controllers/user/updatePassword.controller');
const validate = require('../middlewares/validate');
const updatePasswordSchema = require('../validators/updatePasswordSchema')




const updateUser = express.Router();

updateUser.put('/updatePassword/:id', verifyToken, validate(updatePasswordSchema), updatePassword);


module.exports = updateUser;