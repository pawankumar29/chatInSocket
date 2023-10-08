import express from 'express'
import { User } from "../../db/models/user.model"
import { error, response, userInterface } from './user.interface';
import * as jwt from 'jsonwebtoken';
import { where } from 'sequelize';
import constant from '../../constant/response';
import * as Helper from "../../Helper/index"
import { Password } from '../../db/models/password.model';
import { picture } from '../../db/models/picture.model';
import {imageSize} from 'image-size'


const setResponse = Helper.ResponseHelper;

class userHelper {
    signUp = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {

            const { name, email, age, password, mobile,type } = request.body;
            const data = {
                name: name,
                email: email,
                age: age,
                mobile: mobile,
            }

            const userExist: any = await User.findOne({
                where: {
                    email: email
                }
            })

            if (userExist) {
                const error: error = { message: constant.ERROR, error: constant.USER_EXIST_ALREADY };
                return setResponse.default.error400(response, { error: error });
            }

            const hashedPassword = await Helper.generateHash(password);
            const dataToCreate: { id: any } | any = await User.create(data);
            if (dataToCreate && hashedPassword) {
                await Password.create({ hashedPassword: hashedPassword, userId: dataToCreate.id });

                const payload = {
                    email: email,
                    password: password,
                    mobile: mobile,
                    status:5,
                    type:type,
                    userId:dataToCreate.id

                }

                const secret: any = process.env.secret;
                const token = jwt.sign(payload, secret);


                const responseToSend = {
                    status: 1,
                    error: false,
                    message: constant.USER_CREATED,
                    data: token


                }
                request.body.result = responseToSend;
                next();

            }

            else

                throw { msg: constant.INTERNAL_ERROR };


        } catch (error) {

            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });


        }

    }
    Login = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            let responseToSend: response;
            const { email, password } = request.body;


            const data = {
                email: email,
                password: password,

            }


            const userExist: any = await User.findOne({
                where: {
                    email: email
                }
            }
            )

               console.log("userExist--->",userExist);
            if (userExist && ((userExist.status == 1 || userExist.status == 2 || userExist.status == 3))) {


                const passwordMatch: { hashedPassword: string } | any = await Password.findOne({
                    where: {
                        userId: userExist.id
                    }
                })

                const compareHashedPassword = await Helper.compareHashedPassword(password, passwordMatch.hashedPassword);

                if (compareHashedPassword) {
                    const secret: string | any = process.env.secret;
                    const payload = {
                        email: email,
                        password: password,
                        status: userExist.status,
                        mobile: userExist.mobile,
                        userId:userExist.id
                    }
                    const token = jwt.sign(payload, secret);


                    responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.USER_LOGIN,
                        data: token


                    }
                    request.body.result = responseToSend;
                    next();
                }
                else

                    throw { msg: constant.WRONG_DETAILS };

            }
            else
                throw { message: constant.INVALID_USER }


        } catch (error) {

            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });


        }




    }
    update = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {

            let userId = request.params.id;
            const userExist: any = await User.findOne({
                where: {
                    id: userId
                }
            })

            if (request.body.email||request.body.mobile) {
                throw { message: constant.CRED_NOT_ALLOWED };

            }

            let responseToSend: response;

            if (userExist) {
                const update = await User.update(request.body, {
                    where: {
                        id: userId
                    }
                });


                if (update[0]) {

                    responseToSend = {
                        status: 1,
                        error: false,
                        data: constant.UPDATED
                    }

                    request.body.result = responseToSend;

                    next();

                }
            }
            else
                throw { message: constant.INVALID_USER }

        } catch (error) {

            const errorToSend: error = { message: constant.ERROR, error: error };
            return setResponse.default.error400(response, { error: errorToSend });
        }
    }
    sendOtp = async (request: express.Request | any, response: express.Response, next: express.NextFunction
    ) => {
        try {
            let { type } = request.body;
            let Otp = Number(process.env.OTP);
            let data;
            type = Number(type);

            if (type === request.userData.status || request.userData.status === 3) {
                console.log("type--->",type);
                throw { msg: constant.USER_VERIFIED_ALREADY };
            }

            else if (type > 2 || type < 1) {
                throw { msg: constant.WRONG_DETAILS };
            }
            else if (type === 1 && request.userData.status === 2) {
                data = {
                    otp: Otp,
                    mobile: request.userData.mobile,
                    status: 3

                }
            }

            else if (type === 2 && request.userData.status === 1) {
                data = {
                    otp: Otp,
                    email: request.userData.email,
                    status: 3

                }
            }

            else if (type === 1) {
                data = {
                    otp: Otp,
                    mobile: request.userData.mobile,
                    status: 1

                }
            }
            else if (type === 2) {
                data = {
                    otp: Otp,
                    email: request.userData.email,
                    status: 2

                }
            }

            else
                throw { msg: constant.INTERNAL_ERROR }


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

        catch (error) {
            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }


    verifyOtp = async (request: express.Request, response: express.Response, next: express.NextFunction
    ) => {
        try {


            const { email, mobile, token, otp, type } = request.body;



            let Otp = process.env.OTP;
            const key: any = process.env.secret;
            let responseToSend, update;


            const decoded: any = jwt.verify(token, key);


            if (decoded.otp === otp) {

               

                if (type === 1 && decoded.mobile === mobile) {
                    
                    const update = await User.update({ status: decoded.status }, {
                        where: {
                            mobile: decoded.mobile
                        }
                    })

                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.USER_MOBILE_VERIFIED,


                    }
                    request.body.result = responseToSend;
                    next();
                }
                else if (type === 2 && decoded.email === email) {
                    const update = await User.update({ status: decoded.status }, {
                        where: {
                            email: decoded.email
                        }
                    })

                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.USER_EMAIL_VERIFIED,


                    }
                    request.body.result = responseToSend;
                    next();
                }


                else
                    throw { msg: constant.INTERNAL_ERROR }

            }
            else
                throw { msg: constant.INVALID_OTP }


        } catch (error) {
            console.log("error--->", error);
            const errorToSend: error = { message: constant.ERROR, error: error };

            return setResponse.default.error400(response, { error: errorToSend });
        }


    }


    uploadImg = async (request: express.Request|any, response: express.Response, next: express.NextFunction
        ) => {
            try {

                if(request.fileValidationError){
                    throw request.fileValidationError;
                }
           
                const file:any=request.file;
                console.log("gshdgfgd",file);
                const imgExtension=['jpg','jpeg','png'];


              const user:any=await User.findOne({
                where:{
                    email:request.userData.email
                }
              });
              const size=5*1024*1024;
              if(file.size>size){
                 throw {errorMessage:constant.FILE_NOT_SUPPORTED};
              }
   

          const fileType=file.mimetype;
          const fileExt=fileType.split('/');
     const orgExt=fileExt[fileExt.length-1];
     
        if(imgExtension.includes(orgExt)){
            const dimension:any=imageSize(file.path);
            const maxWidth=800;
            const maxHeight=600;
  
            if(dimension.width>maxWidth||dimension.height>maxHeight){
              throw {errorMessage:`kindly enter image with proper size `};
  
            }
  
          }
                if(file&&user){
                    const data={
                        fieldName:file.fieldname,
                        mimeType:file.mimetype,
                        fileName:file.filename,
                        userId:user.id
                    }
                    const dbCreate=await picture.create(data);
                    const responseToSend = {
                        status: 1,
                        error: false,
                        message: constant.DATA_CREATED


                    }
                    request.body.result = responseToSend;
                    next();
                    
                }
                else

                throw {errorMessage:constant.ERROR};
    
               
    
            } catch (error:any) {
                console.log("error--->", error.errorMessage);
                
                const errorToSend:any = {  error: error };
                     
                return setResponse.default.error400(response, { errorMessage:error.errorMessage});
            }
    
    
        }
}


export default new userHelper();
