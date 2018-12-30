var path = require('path');
var fs = require('fs');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
// var exphbs = require('express-handlebars');

var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = { hello: () => 'Hello world!' };

// create the app
var express = require('express');
var app = express();

// rendering engine: handlebars
// app.engine('.hbs', exphbs({
//   defaultLayout: 'main',
//   extname: '.hbs'
// }));
app.set('view engine', 'pug');

/* Database Connection */
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_LOCAL_CONN, { useNewUrlParser: true });
mongoose.connection.on('error', function () {
    console.log('Database connection failure');
    process.exit();
});
mongoose.connection.once('open', function () {
    console.log("Database connection succeeded");
});

// 
// route management for chronicles
const chronicleRoutes = require('./app/routes/chronicles.routes');
// route management for preloaders
const preloadRoutes = require('./app/routes/preloaders.routes');
// route management for users
const userRoutes = require('./app/routes/users.routes');

/* LOGGER */
// create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', {stream: accessLogStream}));

/*CORS*/
app.use(cors());

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// static resources
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/js', express.static(__dirname + '/public/js/'));  // APPLICATION SENT TO CLIENT
app.use('/css', express.static(__dirname + '/public/css/'));// STYLESHEETS SENT TO CLIENT

/* ROUTES */
// attach routes to paths
app.use('/chronicles', chronicleRoutes);
app.use('/preloaders', preloadRoutes);
app.use('/users', userRoutes);

// graphql endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }));

// GET - ROOT
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.get('/', function (req, res, next) {
    // res.render('fisa', {
    //   title: "Cronica Cercetărilor Arheologice din România",
    //   name_chronicle: "Titlul Cronicii"
    // });
    res.render('index', { title: process.env.APP_TITLE, message: process.env.APP_TITLE });
});

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

module.exports = app;
