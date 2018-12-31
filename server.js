require('dotenv').config(); // Sets up dotenv as soon as our application starts
var fs    = require('fs');
var chalk = require('chalk');
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

// Citește cheile 
var key  = fs.readFileSync('certificates/private.key', 'utf8');
var cert = fs.readFileSync('certificates/cronicaarheologica.crt', 'utf8');
var credentials = {
    key: key,
    cert: cert
  };

var http  = require('http');
var https = require('https');
var app   = require('./app');

var server      = http.createServer(app);
var httpsserver = https.createServer(credentials, app);

// setting the socket conections
var io = require('socket.io')(httpsserver);

// socket comm management
io.on('connection', function connected (socket) {

    // establishing a main comm channel
    socket.on('cron-arh', function (data) {
        console.log(chalk.bgMagenta(`[server] <-- serverul a primit: ${data}`));
        socket.emit('cron-arh', `Ai spus asta: ${data}`);
    });

    
    socket.on('logUser', function (data) {
        var User = require('./app/models/users.model');
        User.find({email: data.email}).then( user => {
            if (user.length < 1) {
                socket.emit('logUser', {"user": true, "message": "User already exists!"});
            } else {
                bcrypt.compare(data.password, user[0].password, (err, result) => {
                    if (err) {   
                        socket.emit('logUser', {"message": "Something went wrong"}); 
                    }
                    if (result) {
                        var token = jwt.sign(
                            {
                            email: user[0].email,
                            userId: user[0]._id
                            },
                            process.env.JWT_SECRET,
                            {expiresIn: "2h"}
                        );
                        socket.emit('logUser', token);
                        // TODO: În caza că ai nevoie de setarea unui cookie, aici este entry point-ul
                        // return app.res()           
                    }
                });
            }
        }).catch(err => {
            chalk.bgRed(err);
        });        
    }); 

    // signal disconnect when client severed connection
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(8000, function mes0(){
    console.log('Server pe 8000');
});

httpsserver.listen(4430, function mes1(){
    console.log('Server securizat pe 4430');
});

module.exports = app;