const socket = io();
let currentRoom = '';
let username = '';

function joinRoom() {
  username = document.getElementById('username').value;
  currentRoom = document.getElementById('roomName').value;

  if (!username || !currentRoom) return alert('이름과 방 이름을 입력하세요');

  document.getElementById('room-select').style.display = 'none';
  document.getElementById('chat-container').style.display = 'block';

  socket.emit('join room', currentRoom);
}

socket.on('chat history', (messages) => {
  const chat = document.getElementById('chat');
  chat.innerHTML = '';
  messages.forEach(msg => appendMessage(msg));
});

socket.on('chat message', (msg) => {
  appendMessage(msg);
});

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value;
  if (!message) return;

  const now = new Date();
  const time = now.toLocaleTimeString();

  const msgObj = {
    user: username,
    text: message,
    time,
    room: currentRoom,
  };

  socket.emit('chat message', msgObj);
  input.value = '';
}

function appendMessage({ user, text, time }) {
  const chat = document.getElementById('chat');
  const div = document.createElement('div');
  div.textContent = `[${time}] ${user}: ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
