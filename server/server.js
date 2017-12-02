const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
//Create a server by explicitly calling the createServer method
//instead of letting app.listen do that
var server = http.createServer(app);
//This creates a websockets server so we can listen or emit to events 
var io = socketIO(server);

app.use(express.static(publicPath));

//Register an event listener to the connection of a new user
//to the client side. The socket refers to that specific user's socket
io.on('connection', (socket) => {
    console.log('New user connected!');

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});