import { io } from 'socket.io-client';

let socket = null;

export function initSocket(token) {
  if (socket) return socket;
  const url = import.meta.env.VITE_WS_URL || 'http://localhost:5001';
  socket = io(url, { autoConnect: true, reconnection: true });
  socket.on('connect', () => {
    console.log('socket connected', socket.id);
    socket.emit('authenticate', token);
  });
  socket.on('disconnect', () => console.log('socket disconnected'));
  return socket;
}

export function getSocket() {
  return socket;
}