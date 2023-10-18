
import express from 'express';
import socketController from './socket.controller';
import socketValidation from './socket.validation';
import { postValidate } from '../../middlewares';
import { checkKyc } from './socket.middleware';


const socketRouter = express.Router();

socketRouter.post("/chats",socketValidation.chatBody,postValidate, socketController.uploadChat);
socketRouter.get("/latestChat", socketController.userLatestChat);


export default socketRouter;

