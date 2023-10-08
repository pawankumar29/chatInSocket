"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const user_model_1 = require("./user.model");
const room_model_1 = require("./room.model");
const messages = sequelize_2.default.define('message', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    from: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_model_1.User,
            key: 'id',
        }
    },
    to: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_model_1.User,
            key: 'id',
        }
    },
    roomId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: room_model_1.room,
            key: 'id',
        }
    }
});
exports.default = messages;
