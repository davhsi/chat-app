const express = require('express'); 
const app = express(); 
const { Server } = require('socket.io'); 
const http = require('http'); 
const server = http.createServer(app); 
const io = new Server(server); 
const port = 5000; 

let users = {};

app.get('/', (req, res) => { 
    res.sendFile(__dirname + '/index.html'); 
}); 

io.on('connection', (socket) => { 
    socket.on('signup', ({ username, password }) => {
        if (users[username]) {
            socket.emit('error', 'Username already exists.');
        } else {
            users[username] = { username, password };
            socket.emit('login success', { username });
        }
    });

    socket.on('login', ({ username, password }) => {
        if (users[username] && users[username].password === password) {
            socket.emit('login success', { username });
        } else {
            socket.emit('error', 'Invalid username or password.');
        }
    });

    socket.on('send message', ({ username, message }) => {
        io.emit('send message', { username, message });
    });
}); 

server.listen(port, () => { 
    console.log(`Server listening on port ${port}`); 
});
