"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)('http://localhost:3001');
socket.on('connect', () => {
    console.log('Connected to the server in client');
});
socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});
exports.default = socket;
