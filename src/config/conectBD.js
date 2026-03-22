const mongoose = require('mongoose');


const connectBD = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Conectado a la BD');
        
    } catch (error) {
        console.log('Error al conectarse a la BD');
        process.exit(1)
        
    }
}

module.exports = connectBD;