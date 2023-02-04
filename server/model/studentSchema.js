const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const studentScheme = new mongoose.Schema({
  profession: { type: String, required: true },
  name: { type: String, required: true },
  registrationNo: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: Number, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  isAuth: { type: Boolean, required: true, default: false },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

studentScheme.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bycrypt.hash(this.password, 12);
    this.confirmPassword = await bycrypt.hash(this.confirmPassword, 12);
  }
  next();
});
studentScheme.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log('JWTError');
  }
};

const User = mongoose.model('REGISTRATION', studentScheme);

module.exports = User;
