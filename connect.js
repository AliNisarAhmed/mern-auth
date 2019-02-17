const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connect = (url) => {
  console.log(`connection to mongodb on ${url}`);
  return mongoose.connect(url, { useNewUrlParser: true });
}

module.exports = connect;