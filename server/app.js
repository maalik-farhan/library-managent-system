const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

dotenv.config({ path: './config.env' });
require('./db/conn');

// const User = require('./model/studentSchema');

app.use(express.json());

app.use(require('./routes/auth'));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`your app is listening at localhost:${port}`);
});
