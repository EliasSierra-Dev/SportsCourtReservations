// validators/fields.js
const Joi = require('joi');

const firstNameField = Joi.string().min(3).max(50).required().messages({
    'string.empty': 'El nombre es requerido',
    'any.required': 'El nombre es requerido',
    'string.min': 'El nombre debe tener mínimo 3 caracteres',
    'string.max': 'El nombre debe tener máximo 50 caracteres'
});

const lastNameField = Joi.string().min(3).max(50).required().messages({
    'string.empty': 'El apellido es requerido',
    'any.required': 'El apellido es requerido',
    'string.min': 'El apellido debe tener mínimo 3 caracteres',
    'string.max': 'El apellido debe tener máximo 50 caracteres'
});

const documentTypeField = Joi.string().min(2).max(10).required().messages({
    'string.empty': 'El tipo de documento es requerido',
    'any.required': 'El tipo de documento es requerido',
    'string.min': 'El tipo de documento debe tener mínimo 2 caracteres',
    'string.max': 'El tipo de documento debe tener máximo 10 caracteres'
});

const documentNumberField = Joi.string().min(9).max(10).required().messages({
    'string.empty': 'El número de documento es requerido',
    'any.required': 'El número de documento es requerido',
    'string.min': 'El número de documento debe tener mínimo 9 caracteres',
    'string.max': 'El número de documento debe tener máximo 10 caracteres'
});

const phoneField = Joi.string().min(10).max(12).required().messages({
    'string.empty': 'El teléfono es requerido',
    'any.required': 'El teléfono es requerido',
    'string.min': 'El teléfono debe tener mínimo 10 caracteres',
    'string.max': 'El teléfono debe tener máximo 12 caracteres'
});

const emailField = Joi.string().email().required().messages({
    'string.empty': 'El email es requerido',
    'any.required': 'El email es requerido',
    'string.email': 'El email no tiene un formato válido'
});

const passwordField = Joi.string().min(8).max(100).required().messages({
    'string.empty': 'La contraseña es requerida',
    'any.required': 'La contraseña es requerida',
    'string.min': 'La contraseña debe tener mínimo 8 caracteres',
    'string.max': 'La contraseña debe tener máximo 100 caracteres'
});

const roleField = Joi.string().valid('user', 'admin').required().messages({
    'string.empty': 'El rol es requerido',
    'any.required': 'El rol es requerido',
    'any.only': 'El rol debe ser user o admin'
});

module.exports = { firstNameField, lastNameField, documentTypeField, documentNumberField, phoneField, emailField, passwordField, roleField };