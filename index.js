var express = require('express');
let conf = require('./src/conf');
const cors = require('cors');


var app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


var router = require(`${__dirname}/src/router`)(app, __dirname);

var server = require('http').Server(app);
var io = require('socket.io')(server);

let count = 0;
let ips = [];


io.on('connection', (socket) => {
    var ip = socket.handshake.address;

    socket.on('chatt', msg => io.emit('chatt', msg) );

    socket.on('typing', is => io.emit('typing', is) );

    socket.on('newName', name => io.emit('newName', name));

    socket.on('joined', user => io.emit('joined', user))
    
    var ip = socket.handshake.address;

    if (!ips.hasOwnProperty(ip)) {
        ips[ip] = 1;
        count++;
        io.emit('count', {count: count});
    }

    console.log("client is connected");

    /* Disconnect socket */
    socket.on('disconnect', function() {
        if (ips.hasOwnProperty(ip)) {
            delete ips[ip];
            count--;
            io.emit('count', {count: count});
        }
    });
   
});


server.listen(conf.app.port, () => {
    console.log(`Server started at http://localhost:${conf.app.port}`);
})


