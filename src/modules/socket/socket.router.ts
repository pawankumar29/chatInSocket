
import express from 'express';
import { upload } from '../../Helper';
import socketController from './socket.controller';
import socketValidation from './socket.validation';
import { postValidate } from '../../middlewares';
import { checkKyc } from './socket.middleware';


const socketRouter=express.Router();

// socketRouter.post("/chats", checkKyc, socketValidation.chatBody,postValidate,socketController.uploadChat);
socketRouter.post("/chats", socketController.uploadChat);

// socketRouter.post("/uploadFile",upload.single('file'),socketController.uploadFile);
 socketRouter.post("/joinchat", checkKyc, socketValidation.joinBody,postValidate,socketController.joinChat);
 socketRouter.get("/allChat", socketController.userChatList);
 socketRouter.get("/latestChat", socketController.userLatestChat);
 socketRouter.get("/chatList", socketController.myChatList);


export default socketRouter;

