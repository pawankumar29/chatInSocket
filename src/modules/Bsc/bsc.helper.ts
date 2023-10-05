
import web3 from 'web3';
import { Wallet } from '../../db/models/wallet.model';
import * as Express from 'express';
import { Coin } from '../../db/models/coin.model';
import { Password } from '../../db/models/password.model';
import { response, error } from "./bsc.interface"
import * as Helper from "../../Helper/index"
import constant from "./../../constant/response"
import { User } from '../../db/models/user.model';
import rn from "random-number"
import * as jwt from 'jsonwebtoken';
import { Kyc } from '../../db/models/kyc.model';

const setResponse = Helper.ResponseHelper;

const rpc: string | any = process.env.RPC_URL;
const Web3 = new web3(new web3.providers.HttpProvider(rpc));
class bscHelper {

generateWallet = async (request: Express.Request, response: Express.Response, next: Express.NextFunction
    ) => {

        try {


            let responseToSend: response;
            const data: any = {

                coinId: request.body.coinId,
                status: request.body.status,
                userId: request.body.userId,


            }

            const createWallet = Web3.eth.accounts.create();

            if (createWallet) {
                data.walletAddress = createWallet.address;
                const passwordUpdate = await Password.update({ privateKey: createWallet.privateKey }, {
                    where: {
                        userId: request.body.userId

                    }

                });
                const walletDataUpdate = await Wallet.create(data);

                if (passwordUpdate[0] && walletDataUpdate) {
                    responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.WALLET_CREATED,
                        data: walletDataUpdate


                    }
                    request.body.result = responseToSend;
                    next();

                }
                else
                    throw { msg: constant.WALLET_CRED_ERROR }
            }
            else
                throw { msg: constant.WALLET_CREATE_ERROR };

        } catch (error) {

            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });


        }




    }

// fetchBalance = async (request: Express.Request, response: Express.Response, next: Express.NextFunction
    //     ) => {




    //             let responseToSend: response;

    //             const walletAddress=request.params.walletAddress;


    //             const walletData=await Wallet.findOne({
    //                 where:{
    //                     walletAddress:walletAddress
    //                 },
    //                 include:{
    //                     model:Coin,
    //                     attributes:["tokenAddress"]
    //                 }
    //             })


    //         //     if (walletData) {
    //         //         data.walletAddress = createWallet.address;
    //         //         const passwordUpdate = await Password.update({ privateKey: createWallet.privateKey }, {
    //         //             where: {
    //         //                 userId: request.body.userId

    //         //             }

    //         //         });
    //         //         const walletDataUpdate = await Wallet.create(data);

    //         //         if (passwordUpdate[0] && walletDataUpdate) {
    //         //             responseToSend = {
    //         //                 status: 1,
    //         //                 error: false,
    //         //                 message: constant.WALLET_CREATED,
    //         //                 data: walletDataUpdate


    //         //             }
    //         //             request.body.result = responseToSend;
    //         //             next();

    //         //         }
    //         //         else
    //         //             throw { msg: constant.WALLET_CRED_ERROR }
    //         //     }
    //         //     else
    //         //         throw { msg: constant.WALLET_CREATE_ERROR };

    //         // } catch (error) {

    //         //     console.log("error--->", error);
    //         //     const errorToSend: error = { message: constant.ERROR, error: error };

    //         //     return setResponse.default.error400(response, { error: errorToSend });


    //         // }



















    // }

sendOtp = async (request: Express.Request, response: Express.Response, next: Express.NextFunction
    ) => {
        try {

            const id = request.params.id;

            const userData: any = await User.findOne({
                where: {
                    id: id
                }
            });


            console.log("userData---->", userData);

            let Otp = Number(process.env.OTP);

            if (userData) {
                const data = {
                    otp: Otp,
                    email: userData.email,
                    mobile: userData.mobile
                }

                const key: any = process.env.secret;
                const token = jwt.sign(data, key, {
                    expiresIn: '10m'
                });

                const responseToSend = {
                    status: 1,
                    error: false,
                    message: constant.MESSAGE_SENT,
                    data: token


                }
                request.body.result = responseToSend;
                next();



            }
            else

                throw {
                    msg: constant.USER_NOT_Found
                }




        } catch (error) {
            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }
 verifyOtp = async (request: Express.Request, response: Express.Response, next: Express.NextFunction
    ) => {
        try {


            const { email, mobile, token, otp } = request.body;



            let Otp = process.env.OTP;
            const key: any = process.env.secret;


            const decoded: any = jwt.verify(token, key);

            const userData: any = await User.findOne({
                where: {
                    email: email,
                    mobile: mobile,
                    status: constant.NOT_VERIFIED
                }
            });




            if (decoded.email === email && decoded.mobile === mobile && decoded.otp === otp && userData) {

                const update = await User.update({ status: constant.VERIFIED }, {
                    where: {
                        email: email
                    }
                })

                const responseToSend = {
                    status: 1,
                    error: false,
                    message: constant.USER_VERIFIED,


                }
                request.body.result = responseToSend;
                next();

            }
            else
                throw { msg: constant.INTERNAL_ERROR }


        } catch (error) {
            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }


uploadKyc = async (request: Express.Request, response: Express.Response, next: Express.NextFunction
    ) => {
        try {


            const { aadharNo, frontImg, backImg, userId } = request.body;

            const userData: any = await User.findOne({

                where: {
                    id: userId,

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
                userId: userId

            }


            if (userData && userData.status === constant.VERIFIED&&!kycData) {
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
                  
               const data=await Kyc.findAll({});

               if(data.length){
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
               throw {msg:constant.DATA_NOT_FOUND};
    
               
            } catch (error) {
                console.log("error--->", error);
                const errorToSend: error = { message: constant.ERROR, error: error };
    
                return setResponse.default.error400(response, { error: errorToSend });
            }
    
    
        }


 updateKyc = async (request: Express.Request, response: Express.Response, next: Express.NextFunction
            ) => {
                try {

                    const {aadharNo}=request.body;
                      
                    const kycData: any = await Kyc.findOne({

                        where: {
                            aadharNo: aadharNo,
        
                        }
                    });    
                   if(kycData){

                    const updateData=await Kyc.update(request.body,{
                        where:{
                            aadharNo: aadharNo,

                        }
                    })

                    if(updateData[0]){
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.UPDATED
    
    
                    }
                    request.body.result = responseToSend;
                    next();
                      
                   }
                   else
                   throw {msg:constant.DATA_NOT_UPDATED};
                }
                else
                throw {msg:constant.DATA_NOT_FOUND};

        
                   
                } catch (error) {
                    console.log("error--->", error);
                    const errorToSend: error = { message: constant.ERROR, error: error };
        
                    return setResponse.default.error400(response, { error: errorToSend });
                }
        
        
            }
    
   


}



export default new bscHelper();











export { }