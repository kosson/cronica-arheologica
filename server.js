require('dotenv').config(); // Sets up dotenv as soon as our application starts
const http = require('http');
const app = require('./app');
const port = 8000;
// const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port, function mes(){
    console.log('Server pe 8000');
});
