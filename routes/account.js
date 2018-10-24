var express = require('express')
var router = express.Router();
var User = require('../models/user')
var isAuthenticated = require('../middlewares/isAuthenticated')

  router.get('/signup', function (req, res, next) {
    res.render('signup');
  });
  
  router.post('/signup', function (req, res, next) {
    var u = req.body.username;
    var p = req.body.password;
    var dbU = new User({ username: u , password: p})
    dbU.save(function (err, result) {
      if (!err) {
        req.session.user = u
        res.redirect('/');
      } else {
        next(new Error(send('something went wrong: ' + err.message)))
      }
    })
  })
  
  router.get('/login', function (req, res, next) {
    res.render('login');
  
  });

  router.post('/login', function (req, res, next) {
    var u = req.body.username;
    var p = req.body.password;
    User.findOne({ username: u , password: p}, function (err, results) {
      if (results !== null) {
        req.session.user = results.username
        res.redirect('/')
      } else {
        next(new Error(('incorrect crednetials')))
      }
    })
  })
  
  router.get('/logout', isAuthenticated, function (req, res, next) {
    req.session.user = '';
    res.redirect('/');
  })
module.exports = router;
