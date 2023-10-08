"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_controller_1 = __importDefault(require("./socket.controller"));
const socket_validation_1 = __importDefault(require("./socket.validation"));
const middlewares_1 = require("../../middlewares");
const socket_middleware_1 = require("./socket.middleware");
const socketRouter = express_1.default.Router();
socketRouter.post("/chats", socket_middleware_1.checkKyc, socket_validation_1.default.chatBody, middlewares_1.postValidate, socket_controller_1.default.uploadChat);
socketRouter.post("/joinchat", socket_middleware_1.checkKyc, socket_validation_1.default.joinBody, middlewares_1.postValidate, socket_controller_1.default.joinChat);
socketRouter.get("/allChat", socket_controller_1.default.userChatList);
socketRouter.get("/latestChat", socket_controller_1.default.userLatestChat);
exports.default = socketRouter;
