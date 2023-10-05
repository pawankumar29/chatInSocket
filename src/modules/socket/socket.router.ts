
import express from 'express';
import { upload } from '../../Helper';
import socketController from './socket.controller';
import socketValidation from './socket.validation';
import { postValidate } from '../../middlewares';

const socketRouter=express.Router();

socketRouter.post("/chats",  socketValidation.chatBody,postValidate,socketController.uploadChat);
socketRouter.post("/uploadFile",upload.single('file'),socketController.uploadFile);

export default socketRouter;

