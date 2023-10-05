import * as express from 'express';
// import * as Middlewares from "./bsc.validation";
import { postValidate } from "../../middlewares/index";
import * as Helper from '../../Helper/index';
import * as CM from '../../constant/response';
import * as bsc from "./bsc.helper";

const setResponse = Helper.ResponseHelper.default;

class bscController  {

  public path = '';
  public router = express.Router();
  constructor() {
    this.initializeRoutes();
  }


  private initializeRoutes() {
    this.router
      .all(`/*`)
      .post(
        '/generateWallet',
        //  Middlewares.default.signUpBody,
        //  postValidate,
        bsc.default.generateWallet,
        this.responseHandler
      )
    
      // .post(
      //   '/uploadKyc',
      //   // Middlewares.default.LoginBody,
      //   //  postValidate,
      //   bsc.default.uploadKyc,
      //   this.responseHandler
      // )
      //  .post(
      //   '/updateKyc',
      //   // Middlewares.default.LoginBody,
      //   //  postValidate,
      //   bsc.default.updateKyc,
      //   this.responseHandler
      // )
      // .get(
      //   '/kycList',
      //   // Middlewares.default.LoginBody,
      //   //  postValidate,
      //   bsc.default.kycListing,
      //   this.responseHandler
      // )
    

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


export  default bscController;