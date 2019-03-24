// TODO: Import various things...
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var index = require('./routes/index');
var mongoose = require('mongoose')

// instantiate express app...TODO: make sure that you have required express
var app = express();
// instantiate a mongoose connect call
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw5-new')
mongoose.connect(process.env.MONGODB_URI ||'mongodb://user:pass123@ds117145.mlab.com:17145/priths_data', {useNewUrlParser: true})
// set the express view engine to take care of ejs within html files
app.engine('html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, 'static')))


app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// app.get('/', function (req, res, next) {
//   res.render('index')
// })

app.use('/', index);

// don't put any routes below here!
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
