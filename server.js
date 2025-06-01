const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// 정적 파일 제공 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

// 기본 라우터 (선택)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 소켓 연결 처리
io.on('connection', (socket) => {
  console.log('✅ A user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected');
  });
});

// 서버 실행
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
