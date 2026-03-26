const userModel = require('../../models/user.models');
const registerUserService = require('../../services/registerUser.Service');


async function registerUser(req, res, next) {
  try {
    const user = await registerUserService(req.body)

    res.status(201).json({
      status: 'success',
      msg: 'Usuario registrado con éxito',
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}
module.exports = registerUser;
