const mongoose = require('mongoose');
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection established');
  })
  .catch((err) => {
    console.log('Connection error: ' + err);
  });
