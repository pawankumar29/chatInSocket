"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const password_model_1 = require("./password.model");
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
        unique: true,
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
});
exports.User.hasOne(password_model_1.Password, { foreignKey: 'userId' });
password_model_1.Password.belongsTo(exports.User, { foreignKey: 'userId' });
