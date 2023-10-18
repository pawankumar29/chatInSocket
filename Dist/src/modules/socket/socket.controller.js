"use strict";
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
                        email: req.userData.email,
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
                        yield room_model_1.room.create({ name: randomRoom, type: 'single' });
                        client_1.default.emit('join', { room: randomRoom, type: 'single', userId: senderId });
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
        this.userLatestChat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userData.userId;
                const email = req.body.other_user_email;
                let finalArr = [];
                const checkSenderExistWithRoom = yield user_model_1.User.findOne({
                    where: {
                        id: userId,
                    },
                    include: {
                        model: participant_model_1.participant,
                    }
                });
                const arr2 = checkSenderExistWithRoom.participants;
                let senderArray = [];
                senderArray = arr2.map((ele) => {
                    return ele.roomId;
                });
                let arr1 = [];
                for (const e of senderArray) {
                    const userData = yield participant_model_1.participant.findOne({
                        where: {
                            roomId: e,
                            userId: {
                                [sequelize_1.Op.ne]: userId,
                            },
                        },
                        attributes: ["userId"]
                    });
                    if (userData) {
                        arr1.push(userData.userId);
                        for (const id of arr1) {
                            const userDetails = yield user_model_1.User.findOne({
                                where: {
                                    id: id
                                }
                            });
                            const userDataWithMessage = yield message_model_1.default.findAll({
                                where: {
                                    [sequelize_1.Op.or]: [
                                        {
                                            [sequelize_1.Op.and]: [
                                                { from: userId },
                                                { to: id },
                                            ],
                                        },
                                        {
                                            [sequelize_1.Op.and]: [
                                                { to: userId },
                                                { from: id },
                                            ],
                                        },
                                    ]
                                },
                                order: [['createdAt', 'DESC']],
                                limit: 1,
                            });
                            if (userDataWithMessage.length > 0 && userDetails) {
                                const data = {
                                    email: userDetails.email,
                                    name: userDetails.name,
                                    message: userDataWithMessage[0].message
                                };
                                const exists = finalArr.some((uniqueItem) => uniqueItem.email === data.email);
                                if (!exists)
                                    finalArr.push(data);
                            }
                        }
                    }
                }
                res.json({ status: 1, msg: "user chats", data: finalArr });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
    }
}
exports.default = new socketHelper();
