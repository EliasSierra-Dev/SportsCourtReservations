
const userModel = require("../../models/user.models");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  const {
    firstName,
    lastName,
    documentType,
    documentNumber,
    phone,
    email,
    password,
    role,
  } = req.body;

  try {
    let existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ msg: "EL usuario ya existe" });
    }

    let user = new userModel({
      firstName,
      lastName,
      documentType,
      documentNumber,
      phone,
      email,
      password: bcrypt.hashSync(password, 10),
      role,
    });

    await user.save();
    res.status(201).json({
      msg: "Usuario registrado con éxito",
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}



module.exports = registerUser;
