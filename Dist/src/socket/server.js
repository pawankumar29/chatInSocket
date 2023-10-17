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
exports.initializeSocketServer = void 0;
const socket_io_1 = require("socket.io");
const room_model_1 = require("../db/models/room.model");
const participant_model_1 = require("../db/models/participant.model");
const message_model_1 = __importDefault(require("../db/models/message.model"));
const initializeSocketServer = (httpServer) => {
    const io = new socket_io_1.Server(httpServer);
    io.on('connection', (socket) => {
        console.log('A user connected in server');
        socket.on('join', (msg) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("in app.js calling join", msg);
            try {
                const roomExist = yield room_model_1.room.findOne({
                    where: {
                        name: msg.room
                    }
                });
                if (!roomExist) {
                    const roomData = {
                        name: msg.room,
                        type: msg.type
                    };
                    const roomCreate = yield room_model_1.room.create(roomData);
                    console.log("roomCreate===>", roomCreate);
                    const participantDataToStore = {
                        userId: msg.userId,
                        roomId: roomCreate.id
                    };
                    const participantData = yield participant_model_1.participant.create(participantDataToStore);
                    socket.emit('join', msg);
                }
                else {
                    const participantExist = yield participant_model_1.participant.findOne({
                        where: {
                            userId: msg.userId,
                            roomId: roomExist.id
                        }
                    });
                    if (participantExist) {
                        console.log(`user id ${msg.userId} exist already`);
                    }
                    else {
                        const participantDataToStore = {
                            userId: msg.userId,
                            roomId: roomExist.id
                        };
                        const participantData = yield participant_model_1.participant.create(participantDataToStore);
                    }
                    console.log("errorInJoin==room exist ALREADY");
                }
            }
            catch (error) {
                console.log("errorInJoin-->", error);
            }
        }));
        socket.on('chat', (msg) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("in app.jscalling", msg);
            try {
                const roomExist = yield room_model_1.room.findOne({
                    where: {
                        name: msg.room
                    }
                });
                msg.roomId = roomExist.id;
                const checkParticipant = yield participant_model_1.participant.findOne({
                    where: {
                        roomId: msg.roomId,
                        userId: msg.to
                    }
                });
                if (!checkParticipant) {
                    yield participant_model_1.participant.create({ roomId: msg.roomId,
                        userId: msg.to });
                }
                const messageData = yield message_model_1.default.create(msg);
                console.log("message", messageData);
                socket.emit('chat', msg);
                return messageData;
            }
            catch (error) {
                console.log("errorInChat", error);
            }
        }));
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
exports.initializeSocketServer = initializeSocketServer;
