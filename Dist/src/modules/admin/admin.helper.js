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
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../db/models/user.model");
const constant = __importStar(require("../../constant/response"));
const Helper = __importStar(require("../../Helper/index"));
const kyc_model_1 = require("../../db/models/kyc.model");
const setResponse = Helper.ResponseHelper;
class adminHelper {
    constructor() {
        this.updateKycStatus = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const kycId = request.params.id;
                console.log("kkkkkkk", kycId);
                const kycData = yield kyc_model_1.Kyc.findOne({
                    where: {
                        id: kycId
                    }
                });
                if (kycData && (kycData.status === constant.default.pending || kycData.status === constant.default.failed)) {
                    const update = yield kyc_model_1.Kyc.update({ status: constant.default.complete }, {
                        where: {
                            id: kycId
                        }
                    });
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.default.UPDATED
                    };
                    request.body.result = responseToSend;
                    next();
                }
                else
                    throw { msg: constant.default.INTERNAL_ERROR };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: constant.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.kycList = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const kycData = yield kyc_model_1.Kyc.findAll({
                    where: {
                        status: constant.default.complete
                    }
                });
                if (kycData.length) {
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.default.Data_Found_successfully,
                        data: kycData
                    };
                    request.body.result = responseToSend;
                    next();
                }
                else
                    throw { msg: constant.default.INTERNAL_ERROR };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: constant.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.updateUserStatus = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = request.params.userId;
                const userData = yield user_model_1.User.findOne({
                    where: {
                        id: userId
                    }
                });
                if (userData) {
                    const userUpdate = yield user_model_1.User.update({ status: 0 }, {
                        where: {
                            id: userId
                        }
                    });
                    if (userUpdate[0]) {
                        const responseToSend = {
                            status: 1,
                            error: false,
                            message: constant.default.Data_Found_successfully,
                            data: userData
                        };
                        request.body.result = responseToSend;
                        next();
                    }
                    else
                        throw { msg: constant.default.DATA_NOT_UPDATED };
                }
                else
                    throw { msg: constant.default.INTERNAL_ERROR };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: constant.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.allUsers = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield user_model_1.User.findAll({});
                if (userData.length) {
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.default.Data_Found_successfully,
                        data: userData
                    };
                    request.body.result = responseToSend;
                    next();
                }
                else
                    throw { msg: constant.default.DATA_NOT_FOUND };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: constant.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
    }
}
exports.default = new adminHelper();
