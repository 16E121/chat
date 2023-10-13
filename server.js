// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// const users = {};

// io.on('connection', (socket) => {
//   console.log(`New connection: ${socket.id}`);

//   socket.on('user-join', (username) => {
//     users[socket.id] = username;
//     socket.broadcast.emit('user-connected', username);
//   });

//   socket.on('message', (data) => {
//     const { to, message } = data;
//     if (to in users) {
//       io.to(to).emit('message', {
//         from: users[socket.id],
//         message: message,
//       });
//     }
//   });

//   socket.on('disconnect', () => {
//     const username = users[socket.id];
//     if (username) {
//       delete users[socket.id];
//       io.emit('user-disconnected', username);
//     }
//   });
// });

// server.listen(3000, () => {
//   console.log('Server is up and running on http://localhost:3000');
// });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('user-join', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username);
    });

    socket.on('message', (data) => {
        const { to, message } = data;
        const from = users[socket.id];
        const toSocket = Object.keys(users).find((socketId) => users[socketId] === to);

        if (toSocket) {
            io.to(toSocket).emit('message', {
                from,
                message,
            });
        }
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            delete users[socket.id];
            io.emit('user-disconnected', username);
        }
    });
});

server.listen(3000, () => {
    console.log('Server is up and running on http://localhost:3000');
});
