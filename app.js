var path = require('path')
var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');

var app = express();
// rendering engine: handlebars
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

/*Database Connection*/
//TODO: Șterge linia de mai jos
// mongoose.connect(dbConfig.url);
mongoose.connect(process.env.MONGO_LOCAL_CONN);
mongoose.connection.on('error', function () {
    console.log('Database connection failure');
    process.exit();
});
mongoose.connection.once('open', function () {
    console.log("Database connection succeeded");
});

// route management for chronicles
const chronicleRoutes = require('./app/routes/chronicles.routes');
// route management for preloaders
const preloadRoutes = require('./app/routes/preloaders.routes');
// route management for users
const userRoutes = require('./app/routes/users.routes');

/*MIDDLEWARE*/
app.use(morgan('dev'));

/*CORS*/
app.use(cors());

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// answer test
// app.get('/', function (req, res) {
//   res.send('Salut!')
// })

// uploaded resources
// app.use(express.static('repo'))
// trimite o pagina statica
// app.use('/', express.static('public'));

/* ROUTES */
// attach routes to paths
app.use('/chronicles', chronicleRoutes);
app.use('/preloaders', preloadRoutes);
app.use('/users', userRoutes);

// GET - ROOT
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.get('/', function (req, res, next) {
    res.render('fisa', {
      title: "Cronica Cercetărilor Arheologice din România",
      name_chronicle: "Titlul Cronicii"
    });
});

/*Create the error handling mechanism*/
app.use((req, res, next) => {
    const error = new Error('Resource not found');
    error.status = 404;
    next(error); // cascade error transmission
});

// manage all errors
app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
