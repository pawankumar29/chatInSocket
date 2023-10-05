"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.postValidate = void 0;
const postvalidate_middleware_1 = __importDefault(require("./postvalidate.middleware"));
exports.postValidate = postvalidate_middleware_1.default;
const error_middleware_1 = __importDefault(require("./error.middleware"));
exports.errorMiddleware = error_middleware_1.default;
