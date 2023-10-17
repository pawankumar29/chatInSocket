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
const randomstring_1 = __importDefault(require("randomstring"));
class socketHelper {
    constructor() {
        this.uploadChat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { receiver_email, message } = req.body;
                const checkReceiverExistWithRoom = yield user_model_1.User.findOne({
                    where: {
                        email: receiver_email,
                    },
                    include: {
                        model: participant_model_1.participant,
                    }
                });
                const checkSenderExistWithRoom = yield user_model_1.User.findOne({
                    where: {
                        email: "pk1532@gmail.com",
                    },
                    include: {
                        model: participant_model_1.participant,
                    }
                });
                let roomId;
                let receiverArray = [];
                let senderArray = [];
                if (checkReceiverExistWithRoom) {
                    const arr1 = checkReceiverExistWithRoom.participants;
                    const arr2 = checkSenderExistWithRoom.participants;
                    receiverArray = arr1.map((ele) => {
                        return ele.roomId;
                    });
                    senderArray = arr2.map((ele) => {
                        return ele.roomId;
                    });
                    receiverArray.forEach((e) => {
                        senderArray.forEach((e1) => {
                            if (e === e1)
                                roomId = e;
                        });
                    });
                    const receiverId = checkReceiverExistWithRoom.id;
                    const senderId = checkSenderExistWithRoom.id;
                    if (!roomId) {
                        const randomRoom = randomstring_1.default.generate({
                            length: 12,
                            charset: 'alphabetic'
                        });
                        const a = client_1.default.emit('join', { room: randomRoom, type: 'single', userId: senderId });
                        console.log("randommm===>", randomRoom);
                        const data = {
                            from: senderId,
                            to: receiverId,
                            message: message,
                            room: randomRoom
                        };
                        setTimeout(() => {
                            client_1.default.emit('chat', data);
                        }, 1000);
                    }
                    else {
                        console.log("rook===>", roomId);
                        const findRoom = yield room_model_1.room.findOne({
                            where: {
                                id: roomId
                            }
                        });
                        console.log("findRoom===>", findRoom);
                        const data = {
                            from: senderId,
                            to: receiverId,
                            message: message,
                            room: findRoom.name
                        };
                        client_1.default.emit('chat', data);
                    }
                }
                else {
                    throw { message: "no user present " };
                }
                res.json({ status: 1, data: "message sent successfully " });
            }
            catch (error) {
                console.log("error==>", error);
                res.json({ status: 0, error: error.message || error });
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
                const userId = req.userData.userId;
                const email = req.body.other_user_email;
                const senderUser = yield user_model_1.User.findOne({
                    where: {
                        email: email
                    }
                });
                if (senderUser) {
                    const sender = senderUser.id;
                    const userData = yield message_model_1.default.findAll({
                        where: {
                            [sequelize_1.Op.or]: [
                                {
                                    [sequelize_1.Op.and]: [
                                        { from: userId },
                                        { to: sender },
                                    ],
                                },
                                {
                                    [sequelize_1.Op.and]: [
                                        { to: userId },
                                        { from: sender },
                                    ],
                                },
                            ]
                        },
                        order: [['createdAt', 'DESC']],
                        limit: 1
                    });
                    res.json({ status: 1, msg: "user chats", data: userData });
                }
                else
                    throw { message: 'no other user avalibale ' };
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
        this.myChatList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userData.userId;
                console.log("userId", userId);
                const userData = yield message_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.or]: [{
                                to: userId
                            },
                            { from: userId }
                        ]
                    },
                    include: [
                        {
                            model: user_model_1.User,
                            attributes: ["name", "email", "age", "mobile", "id"],
                            where: {
                                id: { [sequelize_1.Op.not]: userId },
                            },
                        }
                    ],
                    attributes: [["name", "user.name"], ["email", "user.email"], ["age", "user.age"], ["mobile", "user.mobile"]],
                    group: ["User.id"]
                });
                console.log("userdata", userData);
                const result = [];
                for (const item of userData) {
                    const user = item.User;
                    result.push(user);
                }
                res.json({ status: 1, msg: "user chats", data: result });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
        this.chooseUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userData.userId;
                const otherUser = req.body.otherUser;
                const { roomName, type } = req.body;
                otherUser.toLowerCase();
                const findUser = yield user_model_1.User.findOne({
                    where: {
                        [sequelize_1.Op.or]: [
                            { email: otherUser },
                            { mobile: otherUser }
                        ]
                    }
                });
                const roomExist = yield room_model_1.room.findOne({
                    where: {
                        [sequelize_1.Op.or]: [
                            { email: otherUser },
                            { mobile: otherUser }
                        ]
                    }
                });
                if (findUser) {
                    client_1.default.emit('join', { room: room_model_1.room, type: type, userId: findUser.id });
                    client_1.default.emit('join', { room: room_model_1.room, type: type, userId: userId });
                    res.json({ status: 1, msg: "User successfullly added and ready to chat " });
                }
                else
                    throw { message: 'no user found Kindly enter another user ' };
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
    }
}
exports.default = new socketHelper();
