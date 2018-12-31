var path       = require('path');
// TODO: Activate this in production
// var morgan     = require('morgan');
var bodyParser = require('body-parser');
var favicon    = require('serve-favicon');
var mongoose   = require('mongoose');
var express    = require('express');
var app = express();

/*CORS*/
var cors       = require('cors');
app.use(cors());

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// view engine
app.set('view engine', 'pug');

// static resources
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/jquery',    express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/js',        express.static(__dirname + '/public/js/'));  // APPLICATION SENT TO CLIENT
app.use('/css',       express.static(__dirname + '/public/css/'));// STYLESHEETS SENT TO CLIENT

/* Database Connection */
mongoose.set('useCreateIndex', true); // Eliminates deprecation warning
mongoose.connect(process.env.MONGO_LOCAL_CONN, { useNewUrlParser: true });
mongoose.connection.on('error', function () {
    console.log('Database connection failure');
    process.exit();
});
mongoose.connection.once('open', function () {
    console.log("Database connection succeeded");
});

/* ROUTES REQUESTS*/
const chronicleRoutes   = require('./app/routes/chronicles.routes');
const chronicleGqRoutes = require('./app/routes/chronicles.gq.route'); // FIXME: finish the experiment. If not erase!!!
const preloadRoutes     = require('./app/routes/preloaders.routes');
const userRoutes        = require('./app/routes/users.routes');
// GET - ROOT
app.get('/', function (req, res, next) {
    res.render('index', { title: process.env.APP_TITLE, message: process.env.APP_TITLE });
});
app.use('/chronicles', chronicleRoutes); // CHRONICLES
app.use('/preloaders', preloadRoutes);   // PRELOADERS
app.use('/users', userRoutes);           // USERS

// CHRONICLES -GQ
// app.use('/chronicles', chronicleGqRoutes);

// GET /users/login
app.get('/users/login', function (req, res, next) {
    res.render('login', {title: process.env.APP_TITLE});
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

/* LOGGER */
// create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', {stream: accessLogStream}));

module.exports = app;

/*

        address: String
        uat: String
        siruta: String
        ran: String
        toponym: String
        sector: String
        year: String
        siteType: String
        siteCategory: String
        periods: String
        epochs: String
        cultures: String
        members: String
        authorizationNo: String
        authorizationYear: String
        contractValue: String
        startDate: String
        endDate: String
        siteDescription: String
        targets: String
        interpretationResults: String
*/