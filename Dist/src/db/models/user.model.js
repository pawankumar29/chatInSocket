"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const password_model_1 = require("./password.model");
const wallet_model_1 = require("./wallet.model");
const kyc_model_1 = require("./kyc.model");
const picture_model_1 = require("./picture.model");
exports.User = sequelize_2.default.define('User', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        // unique: true,
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    mobile: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        // unique:true
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 5
    },
    type: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1 //1 =user 2=admin
    }
});
exports.User.hasOne(password_model_1.Password, { foreignKey: 'userId' });
password_model_1.Password.belongsTo(exports.User, { foreignKey: 'userId' });
exports.User.hasOne(wallet_model_1.Wallet, { foreignKey: 'userId' });
wallet_model_1.Wallet.belongsTo(exports.User, { foreignKey: 'userId' });
exports.User.hasOne(kyc_model_1.Kyc, { foreignKey: 'userId' });
kyc_model_1.Kyc.belongsTo(exports.User, { foreignKey: 'userId' });
exports.User.hasOne(picture_model_1.picture, { foreignKey: 'userId' });
picture_model_1.picture.belongsTo(exports.User, { foreignKey: 'userId' });
