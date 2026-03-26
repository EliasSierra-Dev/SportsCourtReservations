const jwt = require("jsonwebtoken");
const loginUser = require("../../services/auth.service");
const AppError = require('../../utils/AppError')

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await loginUser({ email, password });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        nombre: user.firstName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    );

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    next(new AppError('Error al iniciar sesión', 500))
  }
}

module.exports = login;
