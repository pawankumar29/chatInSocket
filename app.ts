import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import fs from 'fs';
import path from 'path';

// Import your controllers and middleware as needed
import userController from './src/modules/user/user.controller';
import bscController from './src/modules/Bsc/bsc.controller';
import authController from './auth';
import kycController from './src/modules/Kyc/kyc.controller';
import adminController from './src/modules/admin/admin.controller';
import socketRouter from './src/modules/socket/socket.router';
import { initializeSocketServer } from './src/socket/server';

import "./association";
const app = express();
const server = http.createServer(app);
// const io = new SocketIOServer(server);


initializeSocketServer(server);

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(__dirname + '../uploads'));

const pathee=path.join(__dirname, '../views');

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('chat', async (message) => {
//       console.log("hello Pawan")
//     io.emit('chat', { text: message.text, sender: socket.id }); // Broadcast the message to all clients
//   });

//   socket.on('user', async (messagee) => {

//     console.log('Received message:', messagee);
//     const t = await messages.create({ text: messagee, sender: 1 });
//     io.emit('chat message', messagee); // Broadcast the message to all clients
//   });

//   socket.on('uploadFile', async (fileData) => {
//     const uniqueFileName = `${Date.now()}_${fileData.name}.txt`;

//     fs.writeFileSync(`${pathe}/${uniqueFileName}`, fileData.data, 'base64');

//     const message = {
//       sender: socket.id,
//       filePath: `${pathe}/${uniqueFileName}`,
//     };
// // console.log("in upload");
// //     await messages.create(message);

//     io.emit('fileUploaded', message); // Broadcast the uploaded file to all clients
//   });

//   // Handle disconnect
//   // socket.on('disconnect', () => {
//   //   console.log('A user disconnected');
//   // });
// });

app.use(express.json());

const pathe = path.join(__dirname, '../uploads');

console.log("path", pathe);

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs')

const user = new userController().router;
const bsc = new bscController().router;
const kyc = new kycController().router;
const admin = new adminController().router;

app.use(user);
app.use(cors({ origin: "*" }));
app.get("/chatSection",async(req,res)=>{
     try {
      return res.render('index');
      
     } catch (error) {
      return res.json({error:error})
     }
})
 app.use('*', authController);

app.use(kyc);
app.use(bsc);
app.use(admin);
app.use(socketRouter);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





