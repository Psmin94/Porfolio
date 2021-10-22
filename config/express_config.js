var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compress = require('compression');
var morgan = require('morgan');
var config = require('./config');
var session = require('express-session');

module.exports = function () {
    var app = express();

    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(session({
        saveUninitialized : true,
        resave : true,
        secret : config.sessionSecret
    }));

    app.set("views", "./app/views"); // views 폴더 위치는 파일 require 위치 기준
    app.set("view engine", "ejs");

    require('../app/routes/index.server.route')(app);
    app.use(express.static('./public')); // static 설정은 route require 뒤에 작성
    
    return app;
};