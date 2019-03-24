var express = require('express')
var router = express.Router();
var User = require('../models/user')

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:user', function(req, res, next) {
  User.find( {name: req.params.user}, function(err, data) {
    res.json(data)
  })
});

router.get('/all/:user', function(req, res, next) {
  User.find( {name: {$ne: req.params.user}}, function(err, data) {
    res.json(data)
  })
});

router.get('/valid/:user', function(req, res, next) {
  User.find({name: req.params.user}, function(err, data) {
    res.json(data)
  })
});

router.post('/adduser/:uid/:fid', function(req, res, next) {
  User.updateOne({name: req.params.uid}, {$push: {likes: req.params.fid}}, function(err, data) {
    res.json(data)
  })
});

router.post('/finishratings/:uid', function(req, res, next) {
  User.updateOne({name: req.params.uid}, {finishedRatings: true}, function(err, data) {
    res.json(data)
  })
});

router.get('/matches/:user', function(req, res, next) {
  User.find({name: {$ne: req.params.user}, likes: {$in: [req.params.user]}}, function(err, data) {
    res.json(data)
  })
});


module.exports = router;
