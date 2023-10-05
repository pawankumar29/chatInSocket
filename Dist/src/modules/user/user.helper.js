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
const user_model_1 = require("../../db/models/user.model");
const jwt = __importStar(require("jsonwebtoken"));
const response_1 = __importDefault(require("../../constant/response"));
const Helper = __importStar(require("../../Helper/index"));
const password_model_1 = require("../../db/models/password.model");
const picture_model_1 = require("../../db/models/picture.model");
const image_size_1 = require("image-size");
const setResponse = Helper.ResponseHelper;
class userHelper {
    constructor() {
        this.signUp = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, age, password, mobile, type } = request.body;
                const data = {
                    name: name,
                    email: email,
                    age: age,
                    mobile: mobile,
                };
                const userExist = yield user_model_1.User.findOne({
                    where: {
                        email: email
                    }
                });
                if (userExist) {
                    const error = { message: response_1.default.ERROR, error: response_1.default.USER_EXIST_ALREADY };
                    return setResponse.default.error400(response, { error: error });
                }
                const hashedPassword = yield Helper.generateHash(password);
                const dataToCreate = yield user_model_1.User.create(data);
                if (dataToCreate && hashedPassword) {
                    yield password_model_1.Password.create({ hashedPassword: hashedPassword, userId: dataToCreate.id });
                    const payload = {
                        email: email,
                        password: password,
                        mobile: mobile,
                        status: 5,
                        type: type
                    };
                    const secret = process.env.secret;
                    const token = jwt.sign(payload, secret);
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: response_1.default.USER_CREATED,
                        data: token
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
        this.Login = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let responseToSend;
                const { email, password } = request.body;
                const data = {
                    email: email,
                    password: password,
                };
                const userExist = yield user_model_1.User.findOne({
                    where: {
                        email: email
                    }
                });
                console.log("userExist--->", userExist);
                if (userExist && ((userExist.status == 1 || userExist.status == 2 || userExist.status == 3))) {
                    const passwordMatch = yield password_model_1.Password.findOne({
                        where: {
                            userId: userExist.id
                        }
                    });
                    const compareHashedPassword = yield Helper.compareHashedPassword(password, passwordMatch.hashedPassword);
                    if (compareHashedPassword) {
                        const secret = process.env.secret;
                        const payload = {
                            email: email,
                            password: password,
                            status: userExist.status,
                            mobile: userExist.mobile,
                        };
                        const token = jwt.sign(payload, secret);
                        responseToSend = {
                            status: 1,
                            error: false,
                            message: response_1.default.USER_LOGIN,
                            data: token
                        };
                        request.body.result = responseToSend;
                        next();
                    }
                    else
                        throw { msg: response_1.default.WRONG_DETAILS };
                }
                else
                    throw { message: response_1.default.INVALID_USER };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.update = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = request.params.id;
                const userExist = yield user_model_1.User.findOne({
                    where: {
                        id: userId
                    }
                });
                if (request.body.email || request.body.mobile) {
                    throw { message: response_1.default.CRED_NOT_ALLOWED };
                }
                let responseToSend;
                if (userExist) {
                    const update = yield user_model_1.User.update(request.body, {
                        where: {
                            id: userId
                        }
                    });
                    if (update[0]) {
                        responseToSend = {
                            status: 1,
                            error: false,
                            data: response_1.default.UPDATED
                        };
                        request.body.result = responseToSend;
                        next();
                    }
                }
                else
                    throw { message: response_1.default.INVALID_USER };
            }
            catch (error) {
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.sendOtp = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { type } = request.body;
                let Otp = Number(process.env.OTP);
                let data;
                type = Number(type);
                if (type === request.userData.status || request.userData.status === 3) {
                    console.log("type--->", type);
                    throw { msg: response_1.default.USER_VERIFIED_ALREADY };
                }
                else if (type > 2 || type < 1) {
                    throw { msg: response_1.default.WRONG_DETAILS };
                }
                else if (type === 1 && request.userData.status === 2) {
                    data = {
                        otp: Otp,
                        mobile: request.userData.mobile,
                        status: 3
                    };
                }
                else if (type === 2 && request.userData.status === 1) {
                    data = {
                        otp: Otp,
                        email: request.userData.email,
                        status: 3
                    };
                }
                else if (type === 1) {
                    data = {
                        otp: Otp,
                        mobile: request.userData.mobile,
                        status: 1
                    };
                }
                else if (type === 2) {
                    data = {
                        otp: Otp,
                        email: request.userData.email,
                        status: 2
                    };
                }
                else
                    throw { msg: response_1.default.INTERNAL_ERROR };
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
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.verifyOtp = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, mobile, token, otp, type } = request.body;
                let Otp = process.env.OTP;
                const key = process.env.secret;
                let responseToSend, update;
                const decoded = jwt.verify(token, key);
                if (decoded.otp === otp) {
                    if (type === 1 && decoded.mobile === mobile) {
                        const update = yield user_model_1.User.update({ status: decoded.status }, {
                            where: {
                                mobile: decoded.mobile
                            }
                        });
                        const responseToSend = {
                            status: 1,
                            error: false,
                            message: response_1.default.USER_MOBILE_VERIFIED,
                        };
                        request.body.result = responseToSend;
                        next();
                    }
                    else if (type === 2 && decoded.email === email) {
                        const update = yield user_model_1.User.update({ status: decoded.status }, {
                            where: {
                                email: decoded.email
                            }
                        });
                        const responseToSend = {
                            status: 1,
                            error: false,
                            message: response_1.default.USER_EMAIL_VERIFIED,
                        };
                        request.body.result = responseToSend;
                        next();
                    }
                    else
                        throw { msg: response_1.default.INTERNAL_ERROR };
                }
                else
                    throw { msg: response_1.default.INVALID_OTP };
            }
            catch (error) {
                console.log("error--->", error);
                const errorToSend = { message: response_1.default.ERROR, error: error };
                return setResponse.default.error400(response, { error: errorToSend });
            }
        });
        this.uploadImg = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (request.fileValidationError) {
                    throw request.fileValidationError;
                }
                const file = request.file;
                console.log("gshdgfgd", file);
                const imgExtension = ['jpg', 'jpeg', 'png'];
                const user = yield user_model_1.User.findOne({
                    where: {
                        email: request.userData.email
                    }
                });
                const size = 5 * 1024 * 1024;
                if (file.size > size) {
                    throw { errorMessage: response_1.default.FILE_NOT_SUPPORTED };
                }
                const fileType = file.mimetype;
                const fileExt = fileType.split('/');
                const orgExt = fileExt[fileExt.length - 1];
                if (imgExtension.includes(orgExt)) {
                    const dimension = (0, image_size_1.imageSize)(file.path);
                    const maxWidth = 800;
                    const maxHeight = 600;
                    if (dimension.width > maxWidth || dimension.height > maxHeight) {
                        throw { errorMessage: `kindly enter image with proper size ` };
                    }
                }
                if (file && user) {
                    const data = {
                        fieldName: file.fieldname,
                        mimeType: file.mimetype,
                        fileName: file.filename,
                        userId: user.id
                    };
                    const dbCreate = yield picture_model_1.picture.create(data);
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: response_1.default.DATA_CREATED
                    };
                    request.body.result = responseToSend;
                    next();
                }
                else
                    throw { errorMessage: response_1.default.ERROR };
            }
            catch (error) {
                console.log("error--->", error.errorMessage);
                const errorToSend = { error: error };
                return setResponse.default.error400(response, { errorMessage: error.errorMessage });
            }
        });
    }
}
exports.default = new userHelper();
