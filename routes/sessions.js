const express = require('express');
const router = new express.Router();
const Session = require('../models/Session');

router.get('/json', (req, res, next)=>{
  if (!req.session.username) {
    res.status(403).send('403 - forbidden');
  } else {
    Session.find().then((sessions) => {
      res.send(sessions);
    });
  }
});

router.delete('/:id', (req, res, next) => {
  const {id} = req.params;
  if (!req.session.username) {
    res.status(403).send('403 - forbidden');
  } else {
    Session.deleteOne({'_id': id}, (err) => {
      if (err) return next(err);
      res.status(200).send('ok');
      console.log('ok');
    });
  }
});

module.exports = router;
