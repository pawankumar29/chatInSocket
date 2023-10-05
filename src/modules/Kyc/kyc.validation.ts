
import {body} from 'express-validator';

import constant from '../../constant/response';


class kycValidation{

   
    public kycUploadBody=[
        body("aadharNo")
        .notEmpty()
        .withMessage(constant.aadharNo_ERROR),
    body("backImg")
        .notEmpty()
        .withMessage(constant.backImg_ERROR),
    body("frontImg")
        .notEmpty()
        .withMessage(constant.frontImg_ERROR)
   
  
    ]



}

export default  new kycValidation();













































export {}