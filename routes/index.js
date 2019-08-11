const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const usersRouter = require('./users');

/**
 * Validates the post request return an answer
 * @param {Request} req post request
 * @return {String} an answer for the validation
 */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

router.get('/home', (req, res, next) => {
  if (req.session.username) {
    res.render('home', {name: req.session.name});
  } else {
    res.redirect('/login');
  }
});

router.use('/users/', usersRouter);

router.get('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/login');
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;

  if (!username || !password) {
    res.render('login', {error: 'Please enter username and password'});
  } else {
    User.findOne({username: username}).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            req.session.username = user.username;
            req.session.name = user.name;
            res.redirect('/home');
          } else {
            res.render('login', {error: 'Incorrect username or password'});
          }
        });
      } else {
        res.render('login', {error: 'Incorrect username or password'});
      }
    } );
  }
});

module.exports = router;
