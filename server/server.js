const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
//Create a server by explicitly calling the createServer method
//instead of letting app.listen do that in order to attach socket.io
var server = http.createServer(app);
//This creates a websockets server so we can emit or listen to events 
var io = socketIO(server);

app.use(express.static(publicPath));

//Register an event listener to the connection of a new user on the
//client side. The socket refers to that specific user's socket
io.on('connection', (socket) => {
    console.log('New user connected!');

    socket.on('createMessage', (message) => {
        console.log('createMessage:', JSON.stringify(message, undefined, 2));
    });

    socket.emit('newMessage', {
        from: 'Server-side User',
        text: 'Hello from server side!',
        createdAt: new Date().toString()
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});