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
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const message_model_1 = require("./src/db/models/message.model");
// Import your controllers and middleware as needed
const user_controller_1 = __importDefault(require("./src/modules/user/user.controller"));
const bsc_controller_1 = __importDefault(require("./src/modules/Bsc/bsc.controller"));
const auth_1 = __importDefault(require("./auth"));
const kyc_controller_1 = __importDefault(require("./src/modules/Kyc/kyc.controller"));
const admin_controller_1 = __importDefault(require("./src/modules/admin/admin.controller"));
const socket_router_1 = __importDefault(require("./src/modules/socket/socket.router"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
exports.io = io;
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/uploads', express_1.default.static(__dirname + '../uploads'));
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('chat message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        io.emit('chat message', { text: message.text, sender: socket.id }); // Broadcast the message to all clients
    }));
    socket.on('user', (messagee) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Received message:', messagee);
        const t = yield message_model_1.messages.create({ text: messagee, sender: 1 });
        io.emit('chat message', messagee); // Broadcast the message to all clients
    }));
    socket.on('uploadFile', (fileData) => __awaiter(void 0, void 0, void 0, function* () {
        const uniqueFileName = `${Date.now()}_${fileData.name}.txt`;
        fs_1.default.writeFileSync(`${pathe}/${uniqueFileName}`, fileData.data, 'base64');
        const message = {
            sender: socket.id,
            filePath: `${pathe}/${uniqueFileName}`,
        };
        // console.log("in upload");
        //     await messages.create(message);
        io.emit('fileUploaded', message); // Broadcast the uploaded file to all clients
    }));
    // Handle disconnect
    // socket.on('disconnect', () => {
    //   console.log('A user disconnected');
    // });
});
app.use(express_1.default.json());
const pathe = path_1.default.join(__dirname, '../uploads');
console.log("path", pathe);
const user = new user_controller_1.default().router;
const bsc = new bsc_controller_1.default().router;
const kyc = new kyc_controller_1.default().router;
const admin = new admin_controller_1.default().router;
app.use(user);
app.use((0, cors_1.default)({ origin: "*" }));
app.use('*', auth_1.default);
app.use(kyc);
app.use(bsc);
app.use(admin);
app.use(socket_router_1.default);
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
