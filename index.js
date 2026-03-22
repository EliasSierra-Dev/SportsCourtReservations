require('dotenv').config();
const connectBD = require('./src/config/conectBD');
const app = require('./src/app')

const PORT = process.env.PORT || 3000

connectBD();

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en el puerto ${PORT}` );
})

