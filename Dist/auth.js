"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = __importDefault(require("./src/constant/response"));
function authController(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: response_1.default.AUTH_ERROR });
    }
    try {
        const secret = process.env.secret;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log("d---->", decoded);
        if (decoded.status)
            req.userData = decoded;
        else
            throw new Error(response_1.default.User_Not_Active);
        next();
    }
    catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
exports.default = authController;
