const express = require('express');
const fs = require('fs');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

const PORT = 3000;
const MESSAGE_FILE = 'messages.json';

let messagesByRoom = {};

// 이전 채팅 로딩
if (fs.existsSync(MESSAGE_FILE)) {
  const data = fs.readFileSync(MESSAGE_FILE, 'utf-8');
  messagesByRoom = JSON.parse(data);
}

// 정적 파일 제공
app.use(express.static('public'));

// 소켓 연결
io.on('connection', (socket) => {
  let currentRoom = null;

  socket.on('join room', (room) => {
    if (currentRoom) socket.leave(currentRoom);
    currentRoom = room;
    socket.join(room);

    // 해당 방 기록 전송
    const roomMessages = messagesByRoom[room] || [];
    socket.emit('chat history', roomMessages);
  });

  socket.on('chat message', (msg) => {
    const room = msg.room;
    if (!room) return;

    if (!Array.isArray(messagesByRoom[room])) {
    messagesByRoom[room] = [];
}
messagesByRoom[room].push(msg);

    fs.writeFileSync(MESSAGE_FILE, JSON.stringify(messagesByRoom, null, 2));
    io.to(room).emit('chat message', msg);
  });
});

http.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
