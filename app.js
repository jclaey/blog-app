const flash = require('connect-flash'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      engine = require('ejs-mate'),
      passportLocalMongoose = require('passport-local-mongoose'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      connectDB = require('./config/db'),
      express = require('express'),
      session = require('express-session'),
      path = require('path'),
      ejs = require('ejs'),
      User = require('./models/User'),
      Product = require('./models/Product'),
      methodOverride = require('method-override'),
      app = express();

connectDB();

require('./models/Post');
require('./config/passport')(passport);

app.engine('ejs', engine);

// Route Variables
const index = require('./routes/index');
const posts = require('./routes/posts');
const products = require('./routes/products');
const cart = require('./routes/products');

mongoose.Promise = global.Promise;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.locals.moment = require('moment');

app.use(methodOverride('_method'));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Flash Message Setup
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.success = req.session.success || '';
    delete req.session.success;
    res.locals.error = req.session.error || '';
    delete req.session.error;
    res.locals.title = "Blog App";
    next();
});

// app.use(function(err, req, res, next) {
//     req.session.error = err.message;
//     res.redirect('back');
//   });

// Mount Routes
app.use('/', index);
app.use('/posts', posts);
app.use('/products', products);
app.use('/:id/products', cart);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
