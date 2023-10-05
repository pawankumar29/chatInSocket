"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Helper_1 = require("../../Helper");
const socket_controller_1 = __importDefault(require("./socket.controller"));
const socket_validation_1 = __importDefault(require("./socket.validation"));
const middlewares_1 = require("../../middlewares");
const socketRouter = express_1.default.Router();
socketRouter.post("/chats", socket_validation_1.default.chatBody, middlewares_1.postValidate, socket_controller_1.default.uploadChat);
socketRouter.post("/uploadFile", Helper_1.upload.single('file'), socket_controller_1.default.uploadFile);
exports.default = socketRouter;
