import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import userController from './src/modules/user/user.controller';
import bscController from './src/modules/Bsc/bsc.controller';
import authController from './auth';
import kycController from './src/modules/Kyc/kyc.controller';
import adminController from './src/modules/admin/admin.controller';
import socketRouter from './src/modules/socket/socket.router';
import { initializeSocketServer } from './src/socket/server';
import "./association";


const pthee:any=path.join(__dirname, './local.env');

const app = express();
const server = http.createServer(app);

initializeSocketServer(server);

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(__dirname + '../uploads'));

const pathee = path.join(__dirname, '../views');

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
app.get("/chatSection", async (req, res) => {
  try {
    return res.render('index');

  } catch (error) {
    return res.json({ error: error })
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





