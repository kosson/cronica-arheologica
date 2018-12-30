require('dotenv').config(); // Sets up dotenv as soon as our application starts
var fs = require('fs');

// Citește cheile 
var key = fs.readFileSync('certificates/private.key', 'utf8');
var cert = fs.readFileSync('certificates/cronicaarheologica.crt', 'utf8');
var credentials = {
    key: key,
    cert: cert
  };

var http = require('http');
var https = require('https');
var app = require('./app');

// const port = process.env.PORT || 3000;
var server = http.createServer(app);
var httpsserver = https.createServer(credentials, app);

// setting the socket conections
var io = require('socket.io')(httpsserver);

// socket comm management
io.on('connection', function connected (socket) {
    // establishing a main comm channel
    socket.on('general', function (ob) {
        console.log(ob);
    });
    // signal disconnect when client severed connection
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});


server.listen(8000, function mes(){
    console.log('Server pe 8000');
});

httpsserver.listen(4430, function mes(){
    console.log('Server securizat pe 4430');
});

module.exports = app;