
function verifyRole(...roles) {
    // console.log(roles); 
  return (req, res, next) => {
    const { role } = req.user; // viene del middleware verifyToken

    if (!roles.includes(role)) {
      return res.status(403).json({ msg: "Access denied: insufficient permissions" });
    }
    next();
  };
}

module.exports = verifyRole;