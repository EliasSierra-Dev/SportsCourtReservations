const Joi = require("joi");
const { emailField, passwordField} = require("./validatorsFields");

const loginSchema = Joi.object({
  email: emailField,
  password: passwordField
 
});


module.exports =loginSchema;