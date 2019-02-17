const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

// @route POST api/users/register
// @desc Register User
// @access Public

router.post('/register', async (req, res) => {
  // Form validation
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
  
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
  
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.status(200).json(user))
          .catch(err => console.log(err));
      });
    });
    
  } catch (error) {
    console.log('error here');
    res.status(500).send({error: error.message});
  }
});

// @route POST /api/users/login
// @desc Login user and return jwt token
// @access Public
router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ emailnotfound: "Email not found "});
  }

  // compare passwords
  bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch) {
        // User matched
        // create JWT payload
        const payload = {
          id: user.id,
          name: user.name
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 86400 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );

      } else {
        return res.status(400).json({ passwordincorrect: "Password incorrect" });
      }
    })
})

module.exports = router;