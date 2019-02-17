const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');

const connect = require('./connect');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
// passport config
require('./config/passport')(passport);

// Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000;

connect('mongodb://localhost:27017/mern-auth')
  .then(() => {
    app.listen(port, () => console.log(`server running on ${port}`));
  })
  .catch(err => console.log(err));