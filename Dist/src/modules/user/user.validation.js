"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const response_1 = __importDefault(require("../../constant/response"));
class userValidation {
    constructor() {
        this.signUpBody = [
            (0, express_validator_1.body)("name")
                .notEmpty()
                .withMessage(response_1.default.NAME_ERROR),
            (0, express_validator_1.body)("age")
                .notEmpty()
                .withMessage(response_1.default.AGE_ERROR),
            (0, express_validator_1.body)("email")
                .notEmpty()
                .withMessage(response_1.default.EMAIL_ERROR)
                .isEmail().withMessage(response_1.default.WRONG_EMAIL),
            (0, express_validator_1.body)("password")
                .notEmpty()
                .withMessage(response_1.default.PASSWORD_ERROR)
        ];
        this.LoginBody = [
            (0, express_validator_1.body)("email")
                .notEmpty()
                .withMessage(response_1.default.EMAIL_ERROR)
                .isEmail().withMessage(response_1.default.WRONG_EMAIL),
            (0, express_validator_1.body)("password")
                .notEmpty()
                .withMessage(response_1.default.PASSWORD_ERROR)
        ];
        this.sendOtpBody = [
            (0, express_validator_1.body)("type")
                .notEmpty()
                .withMessage(response_1.default.TYPE_NULL)
                .isInt({ min: 1, max: 3 })
                .withMessage("Type must be between 1 and 3"),
        ];
        this.verifyOtpBody = [
            (0, express_validator_1.body)("type")
                .notEmpty()
                .withMessage(response_1.default.TYPE_NULL)
                .isInt({ min: 1, max: 3 })
                .withMessage("Type must be between 1 and 3"),
            (0, express_validator_1.body)("email")
                .notEmpty()
                .withMessage(response_1.default.EMAIL_ERROR)
                .isEmail().withMessage(response_1.default.WRONG_EMAIL),
            (0, express_validator_1.body)("mobile")
                .notEmpty()
                .withMessage(response_1.default.Mobile_ERROR),
            (0, express_validator_1.body)("token")
                .notEmpty()
                .withMessage(response_1.default.TOKEN_ERROR),
            (0, express_validator_1.body)("otp")
                .notEmpty()
                .withMessage(response_1.default.OTP_ERROR)
        ];
    }
}
exports.default = new userValidation();
