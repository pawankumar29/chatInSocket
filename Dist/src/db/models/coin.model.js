"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coin = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
exports.Coin = sequelize_2.default.define('Coin', {
    coinId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    coinName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    coinSymbol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    coinFamily: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    coinStatus: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'active'
    },
    isToken: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tokenAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
});
