"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorMiddleware(error, req, res, next) {
    console.log("errorMiddleware==>");
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    return res.status(status).send({
        message,
        status,
    });
}
exports.default = errorMiddleware;
