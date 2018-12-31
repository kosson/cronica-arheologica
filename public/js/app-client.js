    // Establish socket connection with the server
    var socket = io();
    var token = '';
    socket.on('cron-arh', function connected (data) {
        console.log(`Am primit: ${data}'`);
    });
    socket.on('logUser', function connected (data) {
        console.log(data);
        token = data;
    });