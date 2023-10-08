// socketClient.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Change the URL as per your server

socket.on('connect', () => {
  console.log('Connected to the server in client');
  

});



socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

export default socket;
