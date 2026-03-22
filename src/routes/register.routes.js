const express = require("express");
const registerUser = require("../controllers/authentication/register.controller");
const login = require("../controllers/authentication/loggin.controller");
const loginSchema = require("../validators/loginSchema");
const registerSchema = require("../validators/registerSchema");
const validate = require('../middlewares/validate');

const register = express.Router();

register.post("/register", validate(registerSchema), registerUser);
register.post("/login", validate(loginSchema), login);

module.exports = register;
