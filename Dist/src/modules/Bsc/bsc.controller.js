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
const express = __importStar(require("express"));
const Helper = __importStar(require("../../Helper/index"));
const CM = __importStar(require("../../constant/response"));
const bsc = __importStar(require("./bsc.helper"));
const setResponse = Helper.ResponseHelper.default;
class bscController {
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
            .post('/generateWallet', 
        //  Middlewares.default.signUpBody,
        //  postValidate,
        bsc.default.generateWallet, this.responseHandler);
        // .post(
        //   '/uploadKyc',
        //   // Middlewares.default.LoginBody,
        //   //  postValidate,
        //   bsc.default.uploadKyc,
        //   this.responseHandler
        // )
        //  .post(
        //   '/updateKyc',
        //   // Middlewares.default.LoginBody,
        //   //  postValidate,
        //   bsc.default.updateKyc,
        //   this.responseHandler
        // )
        // .get(
        //   '/kycList',
        //   // Middlewares.default.LoginBody,
        //   //  postValidate,
        //   bsc.default.kycListing,
        //   this.responseHandler
        // )
    }
}
exports.default = bscController;