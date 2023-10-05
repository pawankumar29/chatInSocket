import * as express from 'express';
import * as Middlewares from "./admin.validation";
import { postValidate } from "../../middlewares/index";
import * as Helper from '../../Helper/index';
import * as CM from '../../constant/response';
import adminHelper from "./admin.helper";
import authController from '../../../auth';
import { adminAccessController } from '../../middlewares/kyc.middleware';

const setResponse = Helper.ResponseHelper.default;


class adminController  {

  public path = '';
  public router = express.Router();
  constructor() {
    this.initializeRoutes();
  }


  private initializeRoutes() {
    this.router
      .all(`/*`)
      .put(
        '/updateKycStatus/:id',
        adminAccessController,
        adminHelper.updateKycStatus,
        this.responseHandler
      )
      .get(
        '/kycList',
        adminAccessController,
        adminHelper.kycList,
        this.responseHandler
      )
      .get(
        '/allUsers',
   adminAccessController,
        adminHelper.allUsers,
        this.responseHandler
      )
      .put(
        '/updateUserStatus/:userId',
        adminAccessController,
        adminHelper.updateUserStatus,
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



export  default adminController;