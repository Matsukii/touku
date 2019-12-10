var express = require('express');
let conf = require('./src/conf');
const cors = require('cors');
const fetch = require('node-fetch');

var app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true }));


var router = require(`${__dirname}/src/router`)(app, __dirname);

var server = require('http').Server(app);
var io = require('socket.io')(server);

let count = 0;
let ips = [];

let messages = [];


io.on('connection', (socket) => {
    var ip = socket.handshake.address;

    socket.emit('chatt', {user: 'Dev', message: `visit the project repo <a href="${conf.app.repo}">github.com/matsukii/rocketchat</a>`, rawhtml: true});

    if(messages.length > 0){
        messages.forEach(m => {
            socket.emit('chatt', m);
        });
    }

    socket.on('chatt', msg => {
        io.emit('chatt', msg);
        if(messages.length >= 50){
            messages = messages.slice(1);
        }
        messages.push(msg);
    });

    socket.on('typing', is => io.emit('typing', is) );

    socket.on('newName', name => io.emit('newName', name));

    socket.on('joined', user => io.emit('joined', user));

    socket.on('filter', msg => {
        fetch(`${conf.polarpod.paths.msgFilter}${msg.message}`, {
            method:'GET'
        }).then(m => m.json()).then(m => {
            socket.emit('filter', m.msg);
        });
    });

    socket.on('clearMessages', clear => messages = [] )

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


