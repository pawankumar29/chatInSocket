import * as express from 'express';
import * as Middlewares from "./kyc.validation";
import { postValidate } from "../../middlewares/index";
import * as Helper from '../../Helper/index';
import * as CM from '../../constant/response';
import * as kyc from "./kyc.helper";
import{kycAccessController,adminAccessController,kycAccessControllerPending} from '../../middlewares/kyc.middleware';

const setResponse = Helper.ResponseHelper.default;

class kycController {

  public path = '';
  public router = express.Router();
  constructor() {
    this.initializeRoutes();
  }


  private initializeRoutes() {
    this.router
      .all(`/*`)
      .post(
        '/uploadKyc',
        Middlewares.default.kycUploadBody,
        postValidate,
        kycAccessControllerPending,
        kyc.default.uploadKyc,
        this.responseHandler
      )
      .post(
        '/updateKyc',
        kycAccessController,
        kyc.default.updateKyc,
        this.responseHandler
      )
      // .get(
      //   '/kycList',
      //   adminAccessController,
      //   kyc.default.kycListing,
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
        return setResponse.error400(response, { error: CM.default.ERROR });
      }
    } catch (err: any) {
      console.log(`ERROR:: RESPONSE HANDLER`, err);
      return setResponse.error400(response, { error: err });
    }
  };


}


export default kycController;