const express = require('express');
const http = require('http');
const fs = require('fs');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const MESSAGE_FILE = 'messages.json';
let messagesByRoom = {};

// 저장된 메시지 불러오기
if (fs.existsSync(MESSAGE_FILE)) {
  messagesByRoom = JSON.parse(fs.readFileSync(MESSAGE_FILE, 'utf-8'));
}

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  let currentRoom = null;

  socket.on('join room', (room) => {
    if (currentRoom) socket.leave(currentRoom);
    currentRoom = room;
    socket.join(room);

    const roomMessages = messagesByRoom[room] || [];
    socket.emit('chat history', roomMessages);
  });

  socket.on('chat message', (msg) => {
    const room = msg.room;
    if (!messagesByRoom[room]) messagesByRoom[room] = [];
    messagesByRoom[room].push(msg);

    fs.writeFileSync(MESSAGE_FILE, JSON.stringify(messagesByRoom, null, 2));
    io.to(room).emit('chat message', msg);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
