const socket = io();
let currentRoom = null;

function scrollToBottom() {
  const chat = document.getElementById('chat');
  chat.scrollTop = chat.scrollHeight;
}

// 채팅 기록 받기
socket.on('chat history', (msgs) => {
  const chat = document.getElementById('chat');
  chat.innerHTML = '';
  msgs.forEach((msg) => {
    const div = document.createElement('div');
    div.textContent = formatMessage(msg);
    chat.appendChild(div);
  });
  scrollToBottom();
});

// 새 메시지 받기
socket.on('chat message', (msg) => {
  const chat = document.getElementById('chat');
  const div = document.createElement('div');
  div.textContent = formatMessage(msg);
  chat.appendChild(div);
  scrollToBottom();
});

function formatMessage(msg) {
  return `[${msg.time}] ${msg.user}: ${msg.text}`;
}

function joinRoom() {
  const room = document.getElementById('room').value.trim();
  if (!room || room === currentRoom) return;

  socket.emit('join room', room);
  currentRoom = room;
}

// 전송
function sendMessage() {
  const username = document.getElementById('username').value.trim();
  const message = document.getElementById('message').value.trim();
  const room = document.getElementById('room').value.trim();

  if (!username || !message || !room) return;

  socket.emit('chat message', {
    user: username,
    text: message,
    time: new Date().toLocaleTimeString(),
    room: room
  });

  document.getElementById('message').value = '';
}

// 엔터 전송
document.getElementById('message').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// 방 바꿀 때 감지
document.getElementById('room').addEventListener('change', joinRoom);
