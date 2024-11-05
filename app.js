require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var usersRouter = require('./routes/users');
var partnersRouter = require('./routes/partners');
var favoritesRouter = require('./routes/favorites');
var pusherRouter = require('./routes/pusher');
var groupsRouter = require('./routes/groups');


require("./models/connection");

var app = express();

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/partners', partnersRouter);
app.use('/favorites', favoritesRouter);
app.use('/pusher', pusherRouter);
app.use('/groups', groupsRouter);


module.exports = app;
