const express = require('express');
const router = new express.Router();

/**
 * Validates the post request return an answer
 * @param {Request} req post request
 * @return {String} an answer for the validation
 */
function validateRequest(req) {
  const USERNAME = req.body.username;
  const PASSWORD = req.body.password;

  if (req && USERNAME && PASSWORD) {
    if (PASSWORD.length < 2) {
      return 'something failed';
    } else {
      return 'success';
    }
  }
  return 'something failed';
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/*', (req, res, next) => {
  res.render('index', {result: validateRequest(req)});
});

module.exports = router;
