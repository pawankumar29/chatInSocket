
import express from "express";
import { User } from "../../db/models/user.model";
import * as constant from "../../constant/response";
import * as Helper from "../../Helper/index";
import { Password } from "../../db/models/password.model";
import { Kyc } from "../../db/models/kyc.model";



const setResponse = Helper.ResponseHelper;

class adminHelper {

    updateKycStatus = async (request: express.Request, response: express.Response, next: express.NextFunction
    ) => {
        try {

            const kycId = request.params.id;
             console.log("kkkkkkk",kycId);
            const kycData: any = await Kyc.findOne({
                where: {
                    id: kycId
                }

            })


            if (kycData && (kycData.status === constant.default.pending || kycData.status === constant.default.failed)) {


                const update = await Kyc.update({ status: constant.default.complete }, {
                    where: {
                        id: kycId
                    }
                })



                const responseToSend = {
                    status: 1,
                    error: false,
                    message: constant.default.UPDATED

                }
                request.body.result = responseToSend;
                next();




            }
            else

                throw { msg: constant.default.INTERNAL_ERROR }



        } catch (error) {
            console.log("error--->", error);
            const errorToSend = { message: constant.default.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }
    kycList = async (request: express.Request, response: express.Response, next: express.NextFunction
    ) => {
        try {


            const kycData: any = await Kyc.findAll({
                where: {
                    status: constant.default.complete
                }
            });


            if (kycData.length) {

                const responseToSend = {
                    status: 1,
                    error: false,
                    message: constant.default.Data_Found_successfully,
                    data: kycData

                }
                request.body.result = responseToSend;
                next();
            }
            else
                throw { msg: constant.default.INTERNAL_ERROR };
        } catch (error) {
            console.log("error--->", error);
            const errorToSend = { message: constant.default.ERROR, error: error };
            return setResponse.default.error400(response, { error: errorToSend });
        }


    }

updateUserStatus = async (request: express.Request, response: express.Response, next: express.NextFunction
    ) => {
        try {

            const userId = request.params.userId;

            const userData: any = await User.findOne({
                where: {
                    id: userId
                }
            });


            if (userData) {

                const userUpdate: any = await User.update({ status: 0 }, {
                    where: {
                        id: userId
                    }
                });

                if (userUpdate[0]) {
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.default.Data_Found_successfully,
                        data: userData

                    }
                    request.body.result = responseToSend;
                    next();

                }
                else

                    throw { msg: constant.default.DATA_NOT_UPDATED }



            }
            else

                throw { msg: constant.default.INTERNAL_ERROR }



        } catch (error) {
            console.log("error--->", error);
            const errorToSend = { message: constant.default.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }

allUsers = async (request: express.Request, response: express.Response, next: express.NextFunction
    ) => {
        try {


            const userData: any = await User.findAll({

            });


            if (userData.length) {



                const responseToSend = {
                    status: 1,
                    error: false,
                    message: constant.default.Data_Found_successfully,
                    data: userData

                }
                request.body.result = responseToSend;
                next();

            }
            else

                throw { msg: constant.default.DATA_NOT_FOUND }

        } catch (error) {
            console.log("error--->", error);
            const errorToSend = { message: constant.default.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }
}




export default new adminHelper();







