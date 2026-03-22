const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// definimos las url

app.use('/api', require('./routes/register.routes'))
app.use('/api', require('./routes/user.routes'));
app.use('/api', require('./routes/court.routes'));
app.use('/api', require('./routes/booking.routes'));


module.exports = app;