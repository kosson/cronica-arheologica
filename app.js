const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config/database.config.js');

/*Conectarea la baza de date*/
mongoose.connect(dbConfig.url);
mongoose.connection.on('error', function() {
    console.log('Nu mă pot conecta la bază. Renunț!');
    process.exit();
});
mongoose.connection.once('open', function() {
    console.log("M-am conectat la bază! Totul OK!");
});

/**
 * IMPORTĂ RUTELE:
 * - cronici
 * - preloadere
 * - user
*/
const caRoutes = require('./app/routes/croniciArhelogice.routes');
const preloadRoutes = require('./app/routes/preloaders.routes');
const userRoutes = require('./app/routes/user');

/*MIDDLEWARE-UL folosit*/
app.use(morgan('dev')); // fă logging la rute
app.use(bodyParser.urlencoded({extended: false}));  // parsează corpul cererii
app.use(bodyParser.json());

/*TRATAREA CORS*/
app.use((req, res, next) => {
    // trimiți de la server headerele
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // tratează OPTIONS trimise de browser înainte de a face postingul - preflight
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    };
    next(); // invocă next pentru a trimite cererile pe rute
});

/**
 * RUTELE APLICAȚIEI
*/
app.use('/cronicile', caRoutes);
app.use('/preloaders', preloadRoutes);
app.use('/user', userRoutes);

/*Crearea mecanismului de tratare a erorilor*/
// colectează toate erorile care ar putea apărea
app.use((req, res, next) => {
    const error = new Error('Nu am găsit resursa');
    error.status = 404;
    next(error); // cascadează transmiterea erorilor
});

// gestionează toate erorile
app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;