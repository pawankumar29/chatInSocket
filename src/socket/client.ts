import { io } from 'socket.io-client';

const socket = io('http://localhost:3002'); // URL as per the server

socket.on('connect', () => {
  console.log('Connected to the server in client');
  

});



socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

export default socket;

