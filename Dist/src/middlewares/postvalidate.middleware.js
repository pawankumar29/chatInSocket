"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const response_1 = __importDefault(require("../constant/response"));
/**
 * Throw error if failed to validate
 * @param req
 * @param res
 * @param next
 */
const postValidate = (req, res, next) => {
    const error = (0, express_validator_1.validationResult)(req);
    const responseError = [];
    if (!error.isEmpty()) {
        for (const errorRow of error.array()) {
            responseError.push({ field: errorRow.type, message: errorRow.msg });
        }
        return res.status(response_1.default.BADREQUEST).send({
            response: {
                status: 400,
                message: "Error!",
                error: true,
                data: responseError
            }
        });
    }
    else {
        next();
    }
};
exports.default = postValidate;
