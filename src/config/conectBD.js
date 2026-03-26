const mongoose = require("mongoose");

const connectBD = async () => {
  try {
    const conect = process.env.MONGO_URI;
    if (!conect) {
      throw new Error("MONGO_URI no está definida en el .env");
    }
    await mongoose.connect(conect);
    console.log("Conectado a la BD");

  } catch (error) {
    throw new Error ("Error al conectarse a la BD");
    
  }
};

module.exports = connectBD;
