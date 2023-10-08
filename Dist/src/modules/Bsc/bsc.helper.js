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
const web3_1 = __importDefault(require("web3"));
const wallet_model_1 = require("../../db/models/wallet.model");
const password_model_1 = require("../../db/models/password.model");
const Helper = __importStar(require("../../Helper/index"));
const response_1 = __importDefault(require("./../../constant/response"));
const user_model_1 = require("../../db/models/user.model");
const jwt = __importStar(require("jsonwebtoken"));
const kyc_model_1 = require("../../db/models/kyc.model");
const setResponse = Helper.ResponseHelper;
const rpc = process.env.RPC_URL;
const Web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(rpc));
class bscHelper {
    constructor() {
        this.generateWallet = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let responseToSend;
                const data = {
                    coinId: request.body.coinId,
                    status: request.body.status,
                    userId: request.body.userId,
                };
                const createWallet = Web3.eth.accounts.create();
                if (createWallet) {
                    data.walletAddress = createWallet.address;
                    const passwordUpdate = yield password_model_1.Password.update({ privateKey: createWallet.privateKey }, {
                        where: {
                            userId: request.body.userId
                        }
                    });
                    const walletDataUpdate = yield wallet_model_1.Wallet.create(data);
                    if (passwordUpdate[0] && walletDataUpdate) {
                        responseToSend = {
                            status: 1,
                            error: false,
                            message: response_1.default.WALLET_CREATED,
                            data: walletDataUpdate
                        };
                        request.body.result = responseToSend;
                        next();
                    }
                    else
                        throw { msg: response_1.default.WALLET_CRED_ERROR };
                }
                else
                    throw { msg: response_1.default.WALLET_CREATE_ERROR };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.sendOtp = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = request.params.id;
                const userData = yield user_model_1.User.findOne({
                    where: {
                        id: id
                    }
                });
                console.log("userData---->", userData);
                let Otp = Number(process.env.OTP);
                if (userData) {
                    const data = {
                        otp: Otp,
                        email: userData.email,
                        mobile: userData.mobile
                    };
                    const key = process.env.secret;
                    const token = jwt.sign(data, key, {
                        expiresIn: '10m'
                    });
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: response_1.default.MESSAGE_SENT,
                        data: token
                    };
                    request.body.result = responseToSend;
                    next();
                }
                else
                    throw {
                        msg: response_1.default.USER_NOT_Found
                    };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.verifyOtp = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, mobile, token, otp } = request.body;
                let Otp = process.env.OTP;
                const key = process.env.secret;
                const decoded = jwt.verify(token, key);
                const userData = yield user_model_1.User.findOne({
                    where: {
                        email: email,
                        mobile: mobile,
                        status: response_1.default.NOT_VERIFIED
                    }
                });
                if (decoded.email === email && decoded.mobile === mobile && decoded.otp === otp && userData) {
                    const update = yield user_model_1.User.update({ status: response_1.default.VERIFIED }, {
                        where: {
                            email: email
                        }
                    });
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: response_1.default.USER_VERIFIED,
                    };
                    request.body.result = responseToSend;
                    next();
                }
                else
                    throw { msg: response_1.default.INTERNAL_ERROR };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.uploadKyc = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { aadharNo, frontImg, backImg, userId } = request.body;
                const userData = yield user_model_1.User.findOne({
                    where: {
                        id: userId,
                    }
                });
                const kycData = yield kyc_model_1.Kyc.findOne({
                    where: {
                        aadharNo: aadharNo,
                    }
                });
                const data = {
                    aadharNo: aadharNo,
                    frontImg: frontImg,
                    backImg: backImg,
                    userId: userId
                };
                if (userData && userData.status === response_1.default.VERIFIED && !kycData) {
                    const dataToCreate = yield kyc_model_1.Kyc.create(data);
                    if (dataToCreate) {
                        const responseToSend = {
                            status: 1,
                            error: false,
                            message: response_1.default.MESSAGE_SENT,
                            data: dataToCreate
                        };
                        request.body.result = responseToSend;
                        next();
                    }
                    else
                        throw { msg: response_1.default.DATA_NOT_CREATED };
                }
                else
                    throw { msg: response_1.default.USER_NOT_VERIFIED };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.kycListing = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield kyc_model_1.Kyc.findAll({});
                if (data.length) {
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: response_1.default.MESSAGE_SENT,
                        data: data
                    };
                    request.body.result = responseToSend;
                    next();
                }
                else
                    throw { msg: response_1.default.DATA_NOT_FOUND };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.updateKyc = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { aadharNo } = request.body;
                const kycData = yield kyc_model_1.Kyc.findOne({
                    where: {
                        aadharNo: aadharNo,
                    }
                });
                if (kycData) {
                    const updateData = yield kyc_model_1.Kyc.update(request.body, {
                        where: {
                            aadharNo: aadharNo,
                        }
                    });
                    if (updateData[0]) {
                        const responseToSend = {
                            status: 1,
                            error: false,
                            message: response_1.default.UPDATED
                        };
                        request.body.result = responseToSend;
                        next();
                    }
                    else
                        throw { msg: response_1.default.DATA_NOT_UPDATED };
                }
                else
                    throw { msg: response_1.default.DATA_NOT_FOUND };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
    }
}
exports.default = new bscHelper();
