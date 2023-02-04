const jwt = require('jsonwebtoken');
const User = require('../model/studentSchema');
const Authen = async (req, res, next) => {
  console.log({ req });
  try {
    const rootUser = await User.findOne({});
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
