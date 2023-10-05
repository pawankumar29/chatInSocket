"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyc = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const user_model_1 = require("./user.model");
exports.Kyc = sequelize_2.default.define('Kyc', {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    aadharNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    frontImg: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    backImg: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_model_1.User,
            key: 'id',
        }
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "pending"
    }
});
