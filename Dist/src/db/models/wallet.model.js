"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const user_model_1 = require("./user.model");
const coin_model_1 = require("./coin.model");
exports.Wallet = sequelize_2.default.define('Wallet', {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    walletAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    coinId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: coin_model_1.Coin,
            key: 'coinId',
        },
    },
    balance: {
        type: sequelize_1.DataTypes.DOUBLE,
        defaultValue: 0
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'inActive'
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_model_1.User,
            key: 'id',
        },
    },
});
exports.Wallet.hasMany(coin_model_1.Coin, { foreignKey: 'coinId' });
coin_model_1.Coin.belongsToMany(exports.Wallet, { through: 'coinId' });
