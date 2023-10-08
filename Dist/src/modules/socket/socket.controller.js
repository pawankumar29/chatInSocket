"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_model_1 = __importDefault(require("../../db/models/message.model"));
const user_model_1 = require("../../db/models/user.model");
const client_1 = __importDefault(require("../../socket/client"));
const constant = __importStar(require("../../constant/response"));
const participant_model_1 = require("../../db/models/participant.model");
const room_model_1 = require("../../db/models/room.model");
const sequelize_1 = require("sequelize");
class socketHelper {
    constructor() {
        this.uploadChat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data;
                const { roomName, message, sender } = req.body;
                const userId = req.userData.userId;
                const roomData = yield room_model_1.room.findOne({
                    where: {
                        name: roomName
                    }
                });
                if (roomData) {
                    const participants = yield participant_model_1.participant.findAll({
                        where: {
                            roomId: roomData.id,
                            userId: {
                                [sequelize_1.Op.ne]: userId
                            }
                        }
                    });
                    console.log("party-->", participants);
                    participants.forEach((element) => {
                        console.log("party-->", participants);
                        if (sender) {
                            data = {
                                from: userId,
                                to: element.userId,
                                message: message,
                                roomId: element.roomId
                            };
                        }
                        else {
                            throw { message: "no sender" };
                        }
                        client_1.default.emit('chat', data);
                    });
                    return res.status(200).json({ status: true, message: 'Chat message sent successfully' });
                }
                else
                    throw { message: "no room data" };
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
        this.uploadFile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.User.findOne({
                    where: {
                        email: req.userData.email
                    }
                });
                if (user && user.status == 3) {
                    const message = {
                        sender: user.email,
                        userId: user.id,
                        filePath: req.file.path,
                    };
                    yield message_model_1.default.create(message);
                    client_1.default.emit('fileUploaded', message);
                    return res.status(200).json({ status: true, message: 'File uploaded successfully' });
                }
                else
                    throw { message: "Invalid User" };
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
        this.joinChat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userData.userId;
                const { type, room } = req.body;
                const user = yield user_model_1.User.findOne({
                    where: {
                        email: req.userData.email
                    }
                });
                if (!user)
                    throw { message: constant.default.USER_NOT_Found };
                if (user.status != 3)
                    throw { message: constant.default.Kyc_Pending };
                client_1.default.emit('join', { room: room, type: type, userId: userId });
                res.json({ status: 1, msg: "user Joined Successfully" });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
        this.userChatList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userData.userId;
                const userData = yield message_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.or]: {
                            to: userId,
                            from: userId
                        }
                    }
                });
                res.json({ status: 1, msg: "user chats", data: userData });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
        this.userLatestChat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("in chat latest", req.userData);
                const userId = req.userData.userId;
                console.log("user--->", userId);
                const userData = yield message_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.or]: [
                            { to: userId },
                            { from: userId }
                        ]
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 1
                });
                res.json({ status: 1, msg: "user chats", data: userData });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
    }
}
exports.default = new socketHelper();
