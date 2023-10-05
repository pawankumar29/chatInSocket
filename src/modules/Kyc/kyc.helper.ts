
import web3 from 'web3';
import { Wallet } from '../../db/models/wallet.model';
import * as Express from 'express';
import { Coin } from '../../db/models/coin.model';
import { Password } from '../../db/models/password.model';
import { response, error } from "./kyc.interface"
import * as Helper from "../../Helper/index"
import constant from "../../constant/response"
import { User } from '../../db/models/user.model';
import rn from "random-number"
import * as jwt from 'jsonwebtoken';
import { Kyc } from '../../db/models/kyc.model';

const setResponse = Helper.ResponseHelper;

const rpc: string | any = process.env.RPC_URL;
const Web3 = new web3(new web3.providers.HttpProvider(rpc));
class kycHelper {

    uploadKyc = async (request: Express.Request | any, response: Express.Response, next: Express.NextFunction
    ) => {
        try {
            console.log("rrrr--->",request.userData);
            const email = request.userData.email;
            console.log("email--->",email);
            const { aadharNo, frontImg, backImg } = request.body;

            const userData: any = await User.findOne({

                where: {
                    email: email,

                }
            });


            const kycData: any = await Kyc.findOne({

                where: {
                    aadharNo: aadharNo,

                }
            });

            const data = {
                aadharNo: aadharNo,
                frontImg: frontImg,
                backImg: backImg,
                userId: userData.id

            }


            if (request.userData.status === 3 && !kycData) {
                const dataToCreate: any = await Kyc.create(data);

                if (dataToCreate) {
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.MESSAGE_SENT,
                        data: dataToCreate


                    }
                    request.body.result = responseToSend;
                    next();
                }
                else
                    throw { msg: constant.DATA_NOT_CREATED };
            }
            else

                throw { msg: constant.USER_NOT_VERIFIED };

        } catch (error) {
            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }

    kycListing = async (request: Express.Request, response: Express.Response, next: Express.NextFunction
    ) => {
        try {

            const data = await Kyc.findAll({});

            if (data.length) {
                const responseToSend = {
                    status: 1,
                    error: false,
                    message: constant.MESSAGE_SENT,
                    data: data


                }
                request.body.result = responseToSend;
                next();

            }
            else
                throw { msg: constant.DATA_NOT_FOUND };


        } catch (error) {
            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }

    updateKyc = async (request: Express.Request, response: Express.Response, next: Express.NextFunction
    ) => {
        try {

            const { aadharNo } = request.body;

            const kycData: any = await Kyc.findOne({

                where: {
                    aadharNo: aadharNo,

                }
            });
            if (kycData) {

                const updateData = await Kyc.update(request.body, {
                    where: {
                        aadharNo: aadharNo,

                    }
                })

                if (updateData[0]) {
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.UPDATED


                    }
                    request.body.result = responseToSend;
                    next();

                }
                else
                    throw { msg: constant.DATA_NOT_UPDATED };
            }
            else
                throw { msg: constant.DATA_NOT_FOUND };



        } catch (error) {
            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }

}



export default new kycHelper();











