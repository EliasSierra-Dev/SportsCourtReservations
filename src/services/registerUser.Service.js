const userModel = require("../models/user.models");
const AppError = require("../utils/AppError");

async function registerUserService({
  firstName,
  lastName,
  documentType,
  documentNumber,
  phone,
  email,
  password,
  role,
}) {
  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    throw new AppError("El usuario ya existe", 400);
  }

  const user = new userModel({
    firstName,
    lastName,
    documentType,
    documentNumber,
    phone,
    email,
    password,
    role,
  });
  await user.save();

  return user;
}

module.exports = registerUserService;
