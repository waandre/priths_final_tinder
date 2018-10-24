// TODO: Import various things...
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var accountRoutes = require('./routes/account.js')
var apiRoutes = require('./routes/api')
var mongoose = require('mongoose')
var Question = require('./models/question');
var isAuthenticated = require('./middlewares/isAuthenticated')



// instantiate express app...TODO: make sure that you have required express
var app = express();
// instantiate a mongoose connect call
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw5-new')

// set the express view engine to take care of ejs within html files
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, 'static')))


app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get('/', function (req, res, next) {
  Question.find({}, function (err, results) {
    if (!err) {
      res.render('index', { questions: results, user: req.session.user })
    } else {
        next(new Error(err.message))
    }
  })
});

app.post('/', isAuthenticated, function (req, res, next) {
  var q = req.body.question;
  var dbQ = new Question({ questionText: q, author: req.session.user})
  dbQ.save(function (err, result) {
    if (!err) {
      res.redirect('/');
    } else {
      next(new Error('something went wrong: ' + err.message))
    }
  })
})

app.use('/account', accountRoutes);
app.use('/api', apiRoutes);

// don't put any routes below here!
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
