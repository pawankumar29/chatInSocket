"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const response_1 = __importDefault(require("../../constant/response"));
class socketValidation {
    constructor() {
        this.chatBody = [
            (0, express_validator_1.body)("message")
                .notEmpty()
                .withMessage(response_1.default.NO_MESSAGE),
            (0, express_validator_1.body)("receiver_email")
                .notEmpty()
                .withMessage(response_1.default.NO_PARAM),
        ];
        this.joinBody = [
            (0, express_validator_1.body)("room")
                .notEmpty()
                .withMessage(response_1.default.NO_ROOM),
            (0, express_validator_1.body)("type")
                .notEmpty()
                .withMessage(response_1.default.NO_TYPE),
        ];
    }
}
exports.default = new socketValidation();
