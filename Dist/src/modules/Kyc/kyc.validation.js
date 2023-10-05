"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const response_1 = __importDefault(require("../../constant/response"));
class kycValidation {
    constructor() {
        this.kycUploadBody = [
            (0, express_validator_1.body)("aadharNo")
                .notEmpty()
                .withMessage(response_1.default.aadharNo_ERROR),
            (0, express_validator_1.body)("backImg")
                .notEmpty()
                .withMessage(response_1.default.backImg_ERROR),
            (0, express_validator_1.body)("frontImg")
                .notEmpty()
                .withMessage(response_1.default.frontImg_ERROR)
        ];
    }
}
exports.default = new kycValidation();
