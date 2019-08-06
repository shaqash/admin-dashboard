const express = require('express');
const router = new express.Router();
const User = require('../models/User');

/**
 * Validates the post request return an answer
 * @param {Request} req post request
 * @return {String} an answer for the validation
 */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const {name, username, password, password2} = req.body;
  if (!name || !username || !password || !password2) {
    res.render('sign-up', {error: 'not all fields are filled'});
  } else if (password !== password2) {
    res.render('sign-up', {error: 'passwords must match'});
  } else if (password.length < 6) {
    res.render('sign-up', {error: 'password needs to be 6 characters or ' +
     'longer'});
  } else {
    User.findOne({username: username}).then((user) => {
      if (user) {
        res.render('sign-up', {error: 'username already exits'});
      } else {
        const user = new User({name, username, password});
        user.save().then(() => {
          res.render('login');
        });
      }
    });
  }
});

module.exports = router;
