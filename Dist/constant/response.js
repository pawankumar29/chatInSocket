"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class constant {
    constructor() {
        this.USER_EXIST_ALREADY = 'user Exist Already';
        this.USER_CREATED = 'User Created Successfully';
        this.ERROR = 'error';
        this.LOGIN_SUCCESSFUL = 'User Login Successful';
        this.INVALID_USER = 'Invalid User';
        this.BADREQUEST = 400;
        this.USER_LOGIN = "login Successful";
        this.UPDATED = "updated Successfully";
        this.NAME_ERROR = "please provide the name";
        this.AGE_ERROR = "Please provide the Age";
        this.EMAIL_ERROR = "Please Provide the Email";
        this.PASSWORD_ERROR = "Please Provide the Password";
    }
}
exports.default = new constant();
