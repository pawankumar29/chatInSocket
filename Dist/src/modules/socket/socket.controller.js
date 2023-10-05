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
Object.defineProperty(exports, "__esModule", { value: true });
const message_model_1 = require("../../db/models/message.model");
const user_model_1 = require("../../db/models/user.model");
const app_1 = require("../../../app");
class socketHelper {
    constructor() {
        this.uploadChat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.User.findOne({
                    where: {
                        //  email:req.userData.email
                        email: "pk3@gmail.com"
                    }
                });
                const { text } = req.body;
                //  console.log("sdjfjdsfjdsfds--->",req.userData.email)
                //  console.log("sdjfjdsfjdsfds--->",user)
                if (user && user.status == 3) {
                    const t = yield message_model_1.messages.create({ text: text, sender: user.email, userId: user.id });
                    app_1.io.emit('chat message', { text: text, sender: user.email, userId: user.id });
                    return res.status(200).json({ status: true, message: 'Chat message sent successfully' });
                }
                else
                    throw { message: "Invalid User" };
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
        this.uploadFile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("req-->",req.file);
                const user = yield user_model_1.User.findOne({
                    where: {
                        email: req.userData.email
                    }
                });
                if (user && user.status == 3) {
                    const message = {
                        sender: user.email,
                        userId: user.id,
                        filePath: req.file.path,
                    };
                    yield message_model_1.messages.create(message);
                    app_1.io.emit('fileUploaded', message);
                    return res.status(200).json({ status: true, message: 'File uploaded successfully' });
                }
                else
                    throw { message: "Invalid User" };
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error.message || error });
            }
        });
    }
}
exports.default = new socketHelper();
