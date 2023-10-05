import * as express from 'express';
import * as Middlewares from "./user.validation";
import { postValidate } from "../../middlewares/index";
import * as Helper from '../../Helper/index';
import * as CM from '../../constant/response';
import userHelper from "./user.helper";
import authController from '../../../auth';
import { upload } from '../../Helper/common/common';


const setResponse = Helper.ResponseHelper.default;


class userController  {

  public path = '';
  public router = express.Router();
  constructor() {
    this.initializeRoutes();
  }


  private initializeRoutes() {
    this.router
      .all(`/*`)
      .post(
        '/registerUser',
        upload.single("studentFile"),
         Middlewares.default.signUpBody,
         postValidate,
        userHelper.signUp,
        this.responseHandler
      )
      .post(
        '/Login',
        Middlewares.default.LoginBody,
         postValidate,
        userHelper.Login,
        this.responseHandler
      )
      .put('/update/:id',
      authController,
        userHelper.update,
        this.responseHandler
      )
      .post(
        '/sendOtp',
        authController,
        Middlewares.default.sendOtpBody,
        postValidate,
        userHelper.sendOtp,
        this.responseHandler
      )
      .post(
        '/verifyOtp',
        authController,
        Middlewares.default.verifyOtpBody,
        postValidate,
        userHelper.verifyOtp,
        this.responseHandler
      )
      .post(
        '/uploadImg',
          authController,
        // Middlewares.default.verifyOtpBody,
        // postValidate,
        Helper.upload.single('file'),
        userHelper.uploadImg,
        this.responseHandler
      )

  }

  private responseHandler = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      if (typeof request.body.result != "undefined") {

        return setResponse.success(response, request.body.result);
      } else {
        return setResponse.error400(response, { error:CM.default.ERROR});
      }
    } catch (err:any) {
      console.log(`ERROR:: RESPONSE HANDLER`, err);
      return setResponse.error400(response, { error: err });
    }
  };


}



export  default userController;