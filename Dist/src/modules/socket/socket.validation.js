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
            (0, express_validator_1.body)("text")
                .notEmpty()
                .withMessage(response_1.default.NO_MESSAGE),
        ];
    }
}
exports.default = new socketValidation();
