require('dotenv').config(); // Sets up dotenv as soon as our application starts
const fs = require('fs');

// Citește cheile 
var key = fs.readFileSync('certificates/private.key', 'utf8');
var cert = fs.readFileSync('certificates/cronicaarheologica.crt', 'utf8');
var credentials = {
    key: key,
    cert: cert
  };

const http = require('http');
const https = require('https');
const app = require('./app');

// const port = process.env.PORT || 3000;
const server = http.createServer(app);
const httpsserver = https.createServer(credentials, app);

server.listen(8000, function mes(){
    console.log('Server pe 8000');
});

httpsserver.listen(4430, function mes(){
    console.log('Server securizat pe 4430');
});