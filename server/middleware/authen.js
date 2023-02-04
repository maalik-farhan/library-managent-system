const jwt = require('jsonwebtoken');
const User = require('../model/studentSchema');
const Authen = async (req, res, next) => {
  try {
    const token = req.cookies.jwttoken;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.find({});
    if (!rootUser) {
      throw new Error('User not found');
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (error) {
    res.status(401).send('Unauthenticated: No token available');
    console.log('middleware error');
  }
};
module.exports = Authen;
