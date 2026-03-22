const joi = require('joi');
const { passwordField } = require('./validatorsFields');


const updatePasswordSchema = joi.object({
    password: passwordField
});

module.exports = updatePasswordSchema;