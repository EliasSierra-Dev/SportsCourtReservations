const User = require("../../models/user.models");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Incorrect username and password" });
    }

    let passwordExist = await bcrypt.compare( password, user.password);
    if(!passwordExist){
        return res.status(400).json({msg: 'Incorrect username and password'})
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role,
      nombre: user.firstName
    }, process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRATION}
  )

    res.status(200).json({ token }); 
    
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

module.exports = login;
