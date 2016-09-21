var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('config');
var mongoose = require('mongoose');
var connect = require('connect');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var exphbs  = require('express-handlebars');

// 路由设置
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// app.use(favicon());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  partialsDir: 'views/partials',
  layoutsDir: 'views/layouts',
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: require('./helpers/helper')
}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

/// 初始化mongodb的连接池（默认pool=5）
mongoose.connect(config.get("mongodb.uri"), config.get("mongodb.options"));

app.use(session({
    secret: 'anywhere',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url : config.get("mongodb.uri"),
        ttl : 60 * 60,
    })
}));

/// session拦截器
app.use(function(req,res,next){
    app.locals.User = req.session.user;
    var url = req.originalUrl;
    if (req.session.user) {
        next();
    } else {
        var filters = ['/','/login','/register'];
        if (filters.indexOf(url) < 0 && url.indexOf('/users/code') < 0) {
            res.redirect('/');
        } else {
            next();
        }
    }
});

module.exports = app;

var server = app.listen(app.get("port"), function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

//设置不同的启动环境export NODE_ENV=default && node app.jss
