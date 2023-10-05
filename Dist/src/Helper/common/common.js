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
exports.upload = exports.compareHashedPassword = exports.generateHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
function generateHash(password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const saltRounds = process.env.saltRounds;
            const hashPassword = yield bcrypt_1.default.hash(password, Number(saltRounds));
            return hashPassword;
        }
        catch (error) {
            console.log("errorInHashPassword", error);
            return false;
        }
    });
}
exports.generateHash = generateHash;
function compareHashedPassword(password, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const saltRounds = process.env.saltRounds;
            const hashPassword = yield bcrypt_1.default.compare(password, hash);
            return hashPassword;
        }
        catch (error) {
            console.log("errorInHashedPassword", error);
            return false;
        }
    });
}
exports.compareHashedPassword = compareHashedPassword;
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            // where you want to keep the data
            cb(null, 'public');
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".txt");
        },
    }),
    // fileFilter: function (req:any, file, cb) {
    //   const size=5;
    //     const allowedExtensions = ['.csv','.png','.jpg','.jpeg','.txt'];
    //     const imgExtension=['jpg','jpeg','png'];
    //     const fileExtension = path.extname(file.originalname).toLowerCase();
    //     if (!allowedExtensions.includes(fileExtension)) {
    //       req.fileValidationError = "Forbidden extension";
    //       // return cb(null, false, req.fileValidationErro);
    //       cb(null, true);
    //     }
    //     // if(imgExtension.includes(orgExt)){
    //     //   const dimension:any=imageSize(new Buffer(file.path));
    //     //   const maxWidth=800;
    //     //   const maxHeight=600;
    //     //   if(dimension.width>maxWidth||dimension.height>maxHeight){
    //     //     cb(new Error(`kindly enter image with proper size `));
    //     //   }
    //     // }
    //     cb(null, true);
    // }
});
//   