const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config/database.config.js');

/*Conectarea la baza de date*/
mongoose.connect(dbConfig.url);
mongoose.connection.on('error', function () {
    console.log('Nu mă pot conecta la bază. Renunț!');
    process.exit();
});
mongoose.connection.once('open', function () {
    console.log("M-am conectat la bază! Totul OK!");
});

// importă rutele pentru cronici
const caRoutes = require('./app/routes/croniciArhelogice.routes');
// importă rutele pentru preloadere
const preloadRoutes = require('./app/routes/preloaders.routes');
// importă ruta pentru crearea unui nou utilizator
const userRoutes = require('./app/routes/users.routes');

/*MIDDLEWARE-UL folosit*/
// fă logging la rute
app.use(morgan('dev'));
// rută de încărcare a resurselor
app.use('/repo', express.static('repo'));
// parsează corpul cererii
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*TRATAREA CORS*/
// trimiți de la server headerele
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // tratează OPTIONS trimise de browser înainte de a face postingul - preflight
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    };
    next(); // invocă next pentru a trimite cererile pe rute
});

// atașarea rutelor pe rădăcini
app.use('/cronicile', caRoutes);
app.use('/preloaders', preloadRoutes);

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