"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHelper {
    success(response, data) {
        const finalSuccess = {
            response: {
                status: 200,
                message: data.message,
                error: false,
                data: typeof data.data != 'undefined' ? data.data : [],
            },
        };
        return response.status(200).send(finalSuccess);
    }
    error400(response, data) {
        const errorResponse = [];
        if (typeof data.error === 'object') {
            errorResponse.push(data.error);
        }
        const finalError = {
            response: {
                status: 400,
                message: 'Error',
                error: true,
                data: errorResponse,
            },
        };
        return response.status(400).send(finalError);
    }
    error401(response, data) {
        const errorResponse = [];
        if (typeof data.error === 'object') {
            errorResponse.push(data.error);
        }
        const finalError = {
            response: {
                status: 401,
                message: data.errorMessage ? data.errorMessage : 'Error',
                error: true,
                data: errorResponse,
            },
        };
        return response.status(401).send(finalError);
    }
    error500(response, data) {
        const errorResponse = [];
        if (typeof data.error === 'object') {
            errorResponse.push(data.error);
        }
        const finalError = {
            response: {
                status: 500,
                message: 'Error',
                error: true,
                data: errorResponse,
            },
        };
        return response.status(500).send(finalError);
    }
}
const obj = new ResponseHelper();
exports.default = obj;
