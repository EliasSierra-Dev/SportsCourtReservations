// validators/registerSchema.js
const Joi = require('joi');
const { firstNameField, lastNameField, documentTypeField, documentNumberField, phoneField, emailField, passwordField, roleField } = require('./validatorsFields');

const registerSchema = Joi.object({
    firstName: firstNameField,
    lastName: lastNameField,
    documentType: documentTypeField,
    documentNumber: documentNumberField,
    phone: phoneField,
    email: emailField,
    password: passwordField,
    role: roleField
});

module.exports = registerSchema;