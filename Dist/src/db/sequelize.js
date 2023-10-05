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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// console.log(process.env.dbName);
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.dbName,
    username: process.env.username,
    password: process.env.password,
    dialect: 'mysql',
    logging: false
});
sequelize.sync({ force: false }).then(() => {
    console.log('sync has been established successfully.');
})
    .catch(err => {
    console.error('Unable to connect to the database:', err);
});
sequelize.authenticate().then(() => {
    console.debug(`${process.env.dbName} DB Connection has been established successfully.`);
}).catch((error) => {
    console.error(`${process.env.dbName} DBUnable to connect to the database: ${process.env.dbName}`, error);
});
exports.default = sequelize;
