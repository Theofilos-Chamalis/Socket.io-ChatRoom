// Enable strict JS mode globally to prevent common errors
'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const compression = require('compression');
const helmet = require('helmet');

const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message.js');
const { isRealString } = require('./utils/validation.js');
const { Users } = require('./utils/users.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

//Create a server by explicitly calling the createServer method
//instead of letting app.listen do that in order to attach socket.io
var server = http.createServer(app);

// Use GZIP compression on the requests
app.use(compression());

// Use helmet for securing the requests
app.use(helmet());

//This creates a websockets server so we can emit or listen to events
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

//Register an event listener to the connection of a new user on the
//client side. The socket refers to that specific user's socket
io.on('connection', socket => {
  console.log('New user connected!');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required!');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat app')
    );
    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage('Admin', `${params.name} has joined`)
      );
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      //The io.emit sends the event to all connections
      io.to(user.room).emit(
        'newMessage',
        generateMessage(user.name, message.text)
      );
    }

    //Send an acknowledgement back to the client
    callback();
  });

  socket.on('createLocationMessage', coords => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit(
        'newMessage',
        generateMessage('Admin', `${user.name} has left.`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
