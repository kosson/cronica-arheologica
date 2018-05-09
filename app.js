const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config/database.config.js');

const app = express();

/*Database Connection*/
mongoose.connect(dbConfig.url);
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

// attach routes to paths
app.use('/repo', express.static('repo'));
app.use('/chronicles', chronicleRoutes);
app.use('/preloaders', preloadRoutes);
app.use('/users', userRoutes);

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