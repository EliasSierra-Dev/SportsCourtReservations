const joi = require('joi');
const { startTimeField, endTimeField } = require('./validatorsFields');


const vaidationsBooking = joi.object({
    startTime: startTimeField,
    endTime: endTimeField
});

module.exports = vaidationsBooking;