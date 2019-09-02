const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const svgCaptcha = require('svg-captcha');

/**
 * Validates the post request return an answer
 * @param {Request} req post request
 * @return {String} an answer for the validation
 */

/* GET home page. */
router.get('/', (req, res) => {
  if (req.session.username) {
    res.render('home', {
      name: req.session.name,
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/sign-up', (req, res) => {
  const captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  res.render('sign-up', {validate: captcha.data});
});

router.post('/sign-up', async (req, res) => {
  const {
    name,
    username,
    password,
  } = req.body;
  const error = validateSignup(req);
  await User.findOne({
    username: username,
  }).then((user) => {
    if (user) {
      error.push('username already exits');
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        const user = new User({
          name,
          username,
          password: hash,
        });
        user.save();
      });
    }
  });
  if (error.length) {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;
    res.render('sign-up', {
      error: error.toString(),
      validate: captcha.data,
    });
  } else {
    req.locals.success = 'asdasd';
    res.redirect('/login');
  }
});

/**
 * @param {Request} req
 * @return {Array} error
 */
function validateSignup(req) {
  const error = [];
  const {
    name,
    username,
    password,
    password2,
    captcha,
  } = req.body;
  if (!name || !username || !password || !password2 || !captcha) {
    error.push('All fields must be filled');
  }
  if (password !== password2) {
    error.push('Passwords must match');
  }
  if (password.length < 6) {
    error.push('Password length must be 6 or greater');
  }
  if (req.session.captcha !== captcha) {
    console.log(req.session.captcha + captcha);
    error.push('Wrong captcha');
  }
  return error;
}

router.get('/login', (req, res) => {
  if (req.session.username) {
    res.render('login', {
      error: 'Your other users will be logged out',
    });
  } else {
    res.render('login');
  }
});

router.get('/sign-up', (req, res) => {
  const captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  res.render('sign-up', {validate: captcha.data});
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
 * @return {User}
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
 * @return {boolean}
 */
async function matchPassword(user, password) {
  try {
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.log(error);
  }
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
