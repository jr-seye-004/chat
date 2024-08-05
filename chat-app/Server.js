const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
      socket.join(room);
      io.to(room).emit('message', { user: 'admin', text: `${username} has joined!` });
      io.to(room).emit('status', { user: username, status: 'online' });
    });
  
    socket.on('disconnect', () => {
      io.emit('status', { user: 'User', status: 'offline' });
    });
  });
  

server.listen(port, () => console.log(`Server running on port ${port}`));
