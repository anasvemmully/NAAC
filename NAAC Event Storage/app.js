var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var passport  = require('passport');
require('dotenv').config()

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// var bodyParser = require('body-parser');
// var expressValidator = require('express-validator');


var indexRouter = require('./routes/index');
var adminRouter = require('./routes/auth/index');


var app = express();

//set connection to mongoose
mongoose.connect(process.env.DB_URL, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
  }).then(() => { 
      console.log('Database connection established!'); 
    }
    ).catch(err => {
      console.log('Error connecting to MongoDB: ' + err);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true
  }
));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge : 1000*60*60*24
   },
  store : new MongoStore({
    mongooseConnection: mongoose.connection,
  })
}))


// passport initialisation
app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport);


app.use('/', indexRouter);
app.use('/api/', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
