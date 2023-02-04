const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
require('../db/conn');
const User = require('../model/studentSchema');
const bycrypt = require('bcryptjs');
const authen = require('../middleware/authen');
const detailAuthen = require('../middleware/detailAuthen');

router.get('/', (req, res) => {
  res.send('Hello from router server');
});

// Promise Method for validation

// router.post('/register', (req, res) => {
//   const { name, registrationNo, password, confirmPassword } = req.body;
//   // console.log(name);
//   // console.log(registrationNo);
//   // res.json({ message: req.body });
//   if (!name || !registrationNo || !password || !confirmPassword) {
//     res.status(422).json({ message: 'Please filled all required fields' });
//   }
//   User.findOne({ registrationNo: registrationNo })
//     .then((userExist) => {
//       if (userExist) {
//         res.status(422).json({ message: 'You are already Registered' });
//       } else if (!userExist) {
//         const user = new User({
//           name,
//           registrationNo,
//           password,
//           confirmPassword,
//         });

//         user
//           .save()
//           .then(() => {
//             res.status(201).json({ message: 'User saved successfully' });
//           })
//           .catch(() => {
//             res.status(500).json({ message: 'Failed to save user' });
//           });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// Asynchronous Method for validation

router.post('/register', async (req, res) => {
  const {
    name,
    registrationNo,
    department,
    semester,
    email,
    phoneNo,
    password,
    confirmPassword,
    profession,
  } = req.body;
  if (
    !name ||
    !registrationNo ||
    !department ||
    !semester ||
    !email ||
    !phoneNo ||
    !password ||
    !confirmPassword ||
    !profession
  ) {
    return res
      .status(422)
      .json({ message: 'All the required fields must be filled' });
  }
  try {
    const userExist = await User.findOne({ registrationNo: registrationNo });
    if (userExist) {
      return res.status(422).json({ message: 'You are already registered' });
    } else if (password != confirmPassword) {
      return res.status(422).json({ message: 'Your password is not matched' });
    } else {
      const user = new User({
        name,
        registrationNo,
        department,
        semester,
        email,
        phoneNo,
        password,
        confirmPassword,
        profession,
      });
      // Encrytion
      await user.save();
      res.status(200).json({ message: 'user registration is confirmed' });
    }
  } catch (error) {
    res.status(500).json('There is someThing wrong in registration process');
  }
});

// login

router.post('/login', async (req, res) => {
  try {
    let token;
    const { registrationNo, password } = req.body;

    if (!registrationNo || !password) {
      return res
        .status(422)
        .json({ message: `Please Filled all the required fields` });
    }
    const userLogin = await User.findOne({ registrationNo: registrationNo });

    if (userLogin) {
      let isMatched = await bycrypt.compare(password, userLogin.password);
      token = await userLogin.generateAuthToken();
      console.log(token);
      res.cookie('jwttoken', token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatched) {
        res.status(400).json({ message: 'Invalid Credentials' });
      } else res.status(201).json({ message: 'You are successfully login' });
    } else {
      res.status(400).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.log('There is someThing wrong in your login process');
  }
});

// Admin Dashboard

router.get('/admin/user', authen, (req, res) => {
  console.log('Admin Dashboard');
  res.send(req.rootUser);
});

// Disscription get request
router.get('/admin/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rootUser = await User.findOne({ _id: id });
    if (!rootUser) {
      throw new Error('User not found');
    }
    res.send(rootUser);
    console.log({ rootUser });
  } catch (error) {
    console.log('middleware error');
  }
});

module.exports = router;
