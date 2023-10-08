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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const Middlewares = __importStar(require("./user.validation"));
const index_1 = require("../../middlewares/index");
const Helper = __importStar(require("../../Helper/index"));
const CM = __importStar(require("../../constant/response"));
const user_helper_1 = __importDefault(require("./user.helper"));
const auth_1 = __importDefault(require("../../../auth"));
const common_1 = require("../../Helper/common/common");
const setResponse = Helper.ResponseHelper.default;
class userController {
    constructor() {
        this.path = '';
        this.router = express.Router();
        this.responseHandler = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof request.body.result != "undefined") {
                    return setResponse.success(response, request.body.result);
                }
                else {
                    return setResponse.error400(response, { error: CM.default.ERROR });
                }
            }
            catch (err) {
                console.log(`ERROR:: RESPONSE HANDLER`, err);
                return setResponse.error400(response, { error: err });
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router
            .all(`/*`)
            .post('/registerUser', common_1.upload.single("studentFile"), Middlewares.default.signUpBody, index_1.postValidate, user_helper_1.default.signUp, this.responseHandler)
            .post('/Login', Middlewares.default.LoginBody, index_1.postValidate, user_helper_1.default.Login, this.responseHandler)
            .put('/update/:id', auth_1.default, user_helper_1.default.update, this.responseHandler)
            .post('/sendOtp', auth_1.default, Middlewares.default.sendOtpBody, index_1.postValidate, user_helper_1.default.sendOtp, this.responseHandler)
            .post('/verifyOtp', auth_1.default, Middlewares.default.verifyOtpBody, index_1.postValidate, user_helper_1.default.verifyOtp, this.responseHandler)
            .post('/uploadImg', auth_1.default, Helper.upload.single('file'), user_helper_1.default.uploadImg, this.responseHandler);
    }
}
exports.default = userController;
