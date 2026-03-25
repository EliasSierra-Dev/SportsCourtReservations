const mongoose = require('mongoose')

const courtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sport: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    isActive: { type: Boolean, default: true },
    schedule: [           // ← agregar esto
    {
      date: Date,
      startTime: String, // "08:00"
      endTime: String,   // "10:00"
      isBooked: { type: Boolean, default: false }
    }
  ],
    description: {
        type: String
    }
}, { timestamps: true });

const Court = mongoose.model('Court', courtSchema);
module.exports = Court;