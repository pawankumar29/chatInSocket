"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_model_1 = require("./src/db/models/room.model");
const message_model_1 = __importDefault(require("./src/db/models/message.model"));
const user_model_1 = require("./src/db/models/user.model");
const wallet_model_1 = require("./src/db/models/wallet.model");
const kyc_model_1 = require("./src/db/models/kyc.model");
const password_model_1 = require("./src/db/models/password.model");
const picture_model_1 = require("./src/db/models/picture.model");
const participant_model_1 = require("./src/db/models/participant.model");
user_model_1.User.hasMany(message_model_1.default, { foreignKey: 'from' });
message_model_1.default.belongsTo(user_model_1.User, { foreignKey: 'from' });
user_model_1.User.hasMany(message_model_1.default, { foreignKey: 'to' });
message_model_1.default.belongsTo(user_model_1.User, { foreignKey: 'to' });
user_model_1.User.hasOne(password_model_1.Password, { foreignKey: 'userId' });
password_model_1.Password.belongsTo(user_model_1.User, { foreignKey: 'userId' });
user_model_1.User.hasOne(wallet_model_1.Wallet, { foreignKey: 'userId' });
wallet_model_1.Wallet.belongsTo(user_model_1.User, { foreignKey: 'userId' });
user_model_1.User.hasOne(kyc_model_1.Kyc, { foreignKey: 'userId' });
kyc_model_1.Kyc.belongsTo(user_model_1.User, { foreignKey: 'userId' });
user_model_1.User.hasOne(picture_model_1.picture, { foreignKey: 'userId' });
picture_model_1.picture.belongsTo(user_model_1.User, { foreignKey: 'userId' });
user_model_1.User.hasMany(participant_model_1.participant, { foreignKey: 'userId' });
participant_model_1.participant.belongsTo(user_model_1.User, { foreignKey: 'userId' });
room_model_1.room.hasMany(participant_model_1.participant, { foreignKey: 'roomId' });
participant_model_1.participant.belongsTo(room_model_1.room, { foreignKey: 'roomId' });
room_model_1.room.hasMany(message_model_1.default, { foreignKey: 'roomId' });
message_model_1.default.belongsTo(room_model_1.room, { foreignKey: 'roomId' });
