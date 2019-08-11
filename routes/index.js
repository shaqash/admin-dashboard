const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

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

router.get('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/users.json', (req, res, next)=>{
  if (!req.session.username) {
    res.status(403).send('403 - forbidden');
  } else {
    User.find().then((users) => {
      res.send(users);
    });
  }
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
        bcrypt.hash(password, 10, (err, hash) => {
          const user = new User({name, username, password: hash});
          user.save().then(() => {
            res.render('login', {success: 'Sign up successful, please log in'});
          });
        });
      }
    });
  }
});

router.delete('/users/:username/', (req, res, next) => {
  const {username} = req.params;
  if (!req.session.username) {
    res.status(403).send('403 - forbidden');
  } else {
    User.deleteOne({'username': username}, (err) => {
      if (err) return next(err);
      res.render('home', {success: 'Deletion successful'});
    });
  }
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
