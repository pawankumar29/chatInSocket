"use strict";
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
exports.kycAccessControllerPending = exports.adminAccessController = exports.kycAccessController = void 0;
const response_1 = __importDefault(require("../constant/response"));
const kyc_model_1 = require("../db/models/kyc.model");
const user_model_1 = require("../db/models/user.model");
function kycAccessController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const kycData = yield user_model_1.User.findOne({
                where: {
                    email: req.userData.email
                },
                include: [
                    {
                        model: kyc_model_1.Kyc
                    }
                ]
            });
            if (kycData && kycData.Kyc.status === response_1.default.complete) {
                next();
            }
            else
                throw new Error(response_1.default.Complete_Kyc);
        }
        catch (error) {
            return res.status(401).json({ message: error.message });
        }
    });
}
exports.kycAccessController = kycAccessController;
function kycAccessControllerPending(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const kycData = yield user_model_1.User.findOne({
                where: {
                    email: req.userData.email
                },
                include: [
                    {
                        model: kyc_model_1.Kyc
                    }
                ]
            });
            if (kycData && (kycData.Kyc.status === response_1.default.failed)) {
                next();
            }
            else
                throw new Error(response_1.default.Kyc_Pending);
        }
        catch (error) {
            return res.status(401).json({ message: error.message });
        }
    });
}
exports.kycAccessControllerPending = kycAccessControllerPending;
function adminAccessController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = yield user_model_1.User.findOne({
                where: {
                    email: req.userData.email
                }
            });
            if (userData.type == 2) {
                next();
            }
            else
                throw new Error(response_1.default.Access_Not_Allowed);
        }
        catch (error) {
            return res.status(401).json({ message: error.message });
        }
    });
}
exports.adminAccessController = adminAccessController;
