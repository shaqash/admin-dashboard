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
router.get('/', function(req, res) {
  if (req.session.username) {
    res.render('home', {
      name: req.session.name,
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  if (req.session.username) {
    res.render('login', {
      error: 'Your other users will be logged out',
    });
  } else {
    res.render('login');
  }
});

router.get('/sign-up', function(req, res) {
  res.render('sign-up');
});

router.get('/home', (req, res) => {
  if (req.session.username) {
    res.render('home', {
      name: req.session.name,
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

router.post('/login', async (req, res, next) => {
  const {
    username,
    password,
  } = req.body;

  if (filled(username, password)) {
    loginUser(username, password, req, res);
  } else {
    res.render('login', {
      error: 'Please enter username and password',
    });
  }
});

/**
 * Checks if the fields are filled.
 *
 * @param {string} username
 * @param {string} password
 * @return {boolean} true if fields are filled, false otherwise.
 */
function filled(username, password) {
  if (!username || !password) {
    return false;
  } else {
    return true;
  }
}

/**
 * Gets the user from the database.
 *
 * @param {string} username
 * @return {Promise<User>} A promise that contains the user if the username
 * exists
 */
async function getUser(username) {
  return User.findOne({
    username: username,
  }).exec();
}

/**
 * Checks if the password matches the hash.
 *
 * @param {User} user
 * @param {string} password
 * @return {Promise<boolean>} A promise that returns if the password matched
 * the hash
 */
async function matchPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

/**
 * Logs the user if the credentials are right, otherwise redirect to error page.
 *
 * @param {string} username
 * @param {string} password
 * @param {Request} req
 * @param {Response} res
 */
async function loginUser(username, password, req, res) {
  const user = await getUser(username);
  let success = false;
  if (user) {
    if (await matchPassword(user, password)) {
      req.session.username = user.username;
      req.session.name = user.name;
      res.redirect('/');
      success = true;
    }
  }
  if (!success) {
    res.render('login', {
      error: 'Incorrect username or password',
    });
  }
}

module.exports = router;
