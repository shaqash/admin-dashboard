const express = require('express');
const User = require('../models/User');
const router = new express.Router();
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/json', (req, res, next) => {
  if (!req.session.username) {
    res.status(403).send('403 - forbidden');
  } else {
    User.find().then((users) => {
      res.send(users);
    });
  }
});

router.delete('/:username', (req, res, next) => {
  const {
    username,
  } = req.params;
  if (!req.session.username) {
    res.status(403).send('403 - forbidden');
  } else {
    User.deleteOne({
      'username': username,
    }, (err) => {
      if (err) return next(err);
      res.render('home', {
        success: 'Deletion successful',
      });
    });
  }
});

router.post('/sign-up', (req, res, next) => {
  const {
    name,
    username,
    password,
    password2,
  } = req.body;
  if (!name || !username || !password || !password2) {
    res.render('sign-up', {
      error: 'not all fields are filled',
    });
  } else if (password !== password2) {
    res.render('sign-up', {
      error: 'passwords must match',
    });
  } else if (password.length < 6) {
    res.render('sign-up', {
      error: 'password needs to be 6 characters or ' +
        'longer',
    });
  } else {
    User.findOne({
      username: username,
    }).then((user) => {
      if (user) {
        res.render('sign-up', {
          error: 'username already exits',
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          const user = new User({
            name,
            username,
            password: hash,
          });
          user.save().then(() => {
            // TODO change url to /login when signing up
            res.render('login', {
              success: 'Sign up successful, please log in',
            });
          });
        });
      }
    });
  }
});

router.post('/create', (req, res) => {
  const {
    name,
    username,
    password,
    password2,
  } = req.body;
  const errors = [];
  if (!req.session.username) {
    errors.push('you must be logged in for this action');
  } else if (!name || !username || !password || !password2) {
    errors.push('not all fields are filled');
  } else if (password !== password2) {
    errors.push('passwords are not identical');
  } else if (password.length < 6) {
    errors.push('password is less than 6 characters');
  } else {
    User.findOne({
      username: username,
    }).then((user) => {
      if (user) {
        errors.push('username already exits');
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          const user = new User({
            name,
            username,
            password: hash,
          });
          user.save().then(() => {
            res.send({
              hash: hash,
            });
          });
        });
      }
      if (errors.length) {
        res.send({
          errors: errors,
        });
      }
    });
  }
  if (errors.length) {
    res.send({
      errors: errors,
    });
  }
});

router.post('/update', (req, res) => {
  const {
    username,
    update: {
      username: newUsername,
      name: newName,
      password: newPassword,
      password2: newPassword2,
    },
  } = req.body;
  const errors = [];
  if (!req.session.username) {
    errors.push('you must be logged in for this action');
  } else if (!newUsername && !newName && !newPassword) {
    errors.push('nothing to update');
  } else if (newPassword !== newPassword2) {
    errors.push('passwords do not match');
  } else {
    // check the user to update
    User.findOne({
      username: username,
    }).then((originalUser) => {
      if (!originalUser) {
        errors.push('user does not exists');
      } else {
        const updates = {};
        if (newUsername && originalUser.username !== newUsername) {
          // check if new username is available
          User.findOne({
            username: newUsername,
          }).then((user) => {
            if (!user) {
              updates.username = newUsername;
              if (newName && originalUser.name !== newName) {
                updates.name = newName;
              }
              if (newPassword) {
                bcrypt.compare(newPassword, originalUser.password).
                    then((match) => {
                      if (!match) {
                        bcrypt.hash(newPassword, 10).then((hash) => {
                          updates.password = hash;
                          User.updateOne({
                            username: username,
                          }, updates).
                              then(() => {
                                res.send(updates);
                              });
                        });
                      } else {
                        if (updates.username || updates.name) {
                          User.updateOne({
                            username: username,
                          }, updates).
                              then(() => {
                                res.send(updates);
                              });
                        }
                      }
                    });
              } else {
                if (updates.username || updates.name) {
                  User.updateOne({
                    username: username,
                  }, updates).then(() => {
                    res.send(updates);
                  });
                }
              }
            } else {
              errors.push('username already exists');
            }
            if (errors.length) {
              res.send({
                errors: errors,
              });
            }
          });
        } else {
          if (newName && originalUser.name !== newName) {
            updates.name = newName;
          }
          if (newPassword) {
            bcrypt.compare(newPassword, originalUser.password).then((match) => {
              if (!match) {
                bcrypt.hash(newPassword, 10).then((hash) => {
                  updates.password = hash;
                  User.updateOne({
                    username: username,
                  }, updates).then(() => {
                    res.send(updates);
                  });
                });
              } else {
                if (updates.username || updates.name) {
                  User.updateOne({
                    username: username,
                  }, updates).then(() => {
                    res.send(updates);
                  });
                } else {
                  errors.push('nothing to update');
                }
              }
            });
          } else {
            if (updates.username || updates.name) {
              User.updateOne({
                username: username,
              }, updates).then(() => {
                res.send(updates);
              });
            } else {
              errors.push('nothing to update');
            }
          }
        }
      }
      if (errors.length) {
        res.send({
          errors: errors,
        });
      }
    });
  }

  if (errors.length) {
    res.send({
      errors: errors,
    });
  }
});

module.exports = router;
