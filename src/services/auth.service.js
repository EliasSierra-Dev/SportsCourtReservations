const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const AppError = require("../../src/utils/AppError");

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Incorrect username or password", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Incorrect username or password", 400);
  }

  return user;
}

module.exports = loginUser;
