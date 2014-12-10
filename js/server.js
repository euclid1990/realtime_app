// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 1307;

// Setup redis client
var redis = require('redis');
var redisClient = redis.createClient();

// Setup jwt
const privateTokenKey = 'private_key';
var privateTokenKeyValue = '';
var jwt = require('jsonwebtoken');
redisClient.get(privateTokenKey, function(err, value) {
    console.log('[JWT] Private token key is %s', value);
    privateTokenKeyValue = value;
});

// Basic information
var clients = [];
var userIds = [];

// Init server
server.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('[Server] listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + "/../"));

function validateToken(redisClient, userId, userToken) {
    var result = true;
    // Validate session in redis storage
    redisClient.get(userId, function(err, reply) {
        if (userToken !== reply) {
            console.log('Token invalid');
            result = false;
        }
    });
    return result;
}

var redisListen = function(redis, channel) {
    this.pub = redis.createClient();
    this.sub = redis.createClient();
    this.channel = channel;
    // Listen for data being published to this server
    this.subscribe = function() {
        this.sub.subscribe(this.channel);
        this.sub.on('message', function(channel, msg) {
            // Broadcast the message to all connected clients on this server.
            var data = JSON.parse(msg);
            var i = userIds.indexOf(data.userPoked);
            if (typeof clients[i] !== 'undefined') {
                clients[i].emit('notification', data);
            }
        });
    }
    this.publish = function(data) {
        this.pub.publish(channel, JSON.stringify(data));
    }
}

// Authorization middleware code that denies access globally to all incoming connections
io.use(function(socket, next) {
    var token = socket.request._query.token;
    var userId = socket.request._query.user_id;

    // Verify a token symmetric
    jwt.verify(token, privateTokenKeyValue, function(err, decoded) {
        if (!decoded) {
            return next(new Error('Authentication error'));
        } else if ( /*socket.request.headers.cookie && */ validateToken(redisClient, userId, decoded)) {
            return next();
        }
    });
});

io.sockets.on('connection', function(socket) {
    console.log('[Socket ID] %s', socket.id);
    var redisConnection = new redisListen(redis, socket.id);

    socket.on('verify', function(data) {
        socket.userId = data.userId;
        socket.userToken = data.userToken;
        console.log('[User ID] %s', socket.userId);

        // Tracking socket
        clients.push(socket);
        userIds.push(socket.userId);

        socket.emit('ready', {
            userId: socket.userId,
            msg: 'You have been logged !'
        });

        io.sockets.emit('notice', {
            userId: socket.userId,
            userIds: userIds,
            msg: 'joined !'
        });
        redisConnection.subscribe();
    });

    socket.on('send', function(data) {
        io.sockets.emit('receive', data);
    });

    socket.on('poke', function(data) {
        redisConnection.publish(data);
    });

    socket.on('disconnect', function() {
        // Remove connected socket
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
        userIds.splice(i, 1);
        // Broadcast message to everyone
        io.sockets.emit('remove-notice', {
            userId: socket.userId,
            msg: 'left !'
        });
    });
});