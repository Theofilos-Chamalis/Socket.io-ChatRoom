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

    socket.emit('newMessage',{
        from: 'Admin',
        text: 'Welcome to the chat app',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage',{
        from: 'Admin',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage:', JSON.stringify(message, undefined, 2));
        //The io.emit sends the event to all connections
        io.emit('newMessage',{
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        //The broadcast sends the event to all except the same socket
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    //It emits a message to a single connection
    // socket.emit('newMessage', {
    //     from: 'Server-side User',
    //     text: 'Hello from server side!',
    //     createdAt: new Date().toString()
    // });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});