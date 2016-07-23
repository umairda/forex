var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

var mongoose = require('mongoose');
require('./models/Ohlc');
//mongoose.connect('mongodb://localhost/forex');
require('./models/connection');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');
app.use('/', index);

var users = require('./routes/users');
app.use('/users', users);

var getdifference = require('./routes/get_difference');
app.use('/getdifference',getdifference);

var getlast = require('./routes/get_last');
app.use('/getlast',getlast);

var getDates = require('./routes/get_dates');
app.use('/getdates',getDates);

var readfromdb = require('./routes/read_from_db');
app.use('/readfromdb',readfromdb);

var readfromfile = require('./routes/read_from_file');
app.use('/readfromfile',readfromfile);

var storeindb = require('./routes/store_in_db');
app.use('/storeindb',storeindb);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
	  status: err.status || 500,
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
