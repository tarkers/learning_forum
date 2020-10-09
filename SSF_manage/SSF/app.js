﻿'use strict';

var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');
var GBD = require('./routes/GBD');
var MB = require('./routes/MB');
var BM = require('./routes/BM');
var app = express();

app.engine('.html', require('ejs').__express)
app.set('views', path.join(__dirname, 'views')); //注意path要require一下
app.set('view engine', 'html')

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', users);
app.use('/GBD', GBD)
app.use('/MB', MB)
app.use('/BM', BM)

//以下為最後除錯中間件 勿刪 發布時用
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//// error handlers

//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

//// production error handler
//// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 1338);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
    console.log(process.env.PORT || 1338);
});
