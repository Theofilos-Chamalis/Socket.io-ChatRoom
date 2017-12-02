var socket = io();

//Web socket at client side listening when the connection starts
socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('createMessage', {
        from: 'Client-side user',
        text: 'This is a test email from nick'
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('newMessage:', JSON.stringify(message, undefined, 2));
});