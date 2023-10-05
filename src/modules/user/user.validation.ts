
import {body} from 'express-validator';

import constant from '../../constant/response';


class userValidation{

   
    public signUpBody=[
        body("name")
        .notEmpty()
        .withMessage(constant.NAME_ERROR),
    body("age")
        .notEmpty()
        .withMessage(constant.AGE_ERROR),
    body("email")
        .notEmpty()
        .withMessage(constant.EMAIL_ERROR)
        .isEmail().withMessage(constant.WRONG_EMAIL),
    body("password")
        .notEmpty()
        .withMessage(constant.PASSWORD_ERROR)
  
    ]

    public LoginBody=[
    body("email")
        .notEmpty()
        .withMessage(constant.EMAIL_ERROR)        
        .isEmail().withMessage(constant.WRONG_EMAIL)
        ,
    body("password")
        .notEmpty()
        .withMessage(constant.PASSWORD_ERROR)
  
    ]

    public sendOtpBody=[
        body("type")
            .notEmpty()
            .withMessage(constant.TYPE_NULL) 
            .isInt({ min: 1, max: 3 }) 
        .withMessage("Type must be between 1 and 3"),       
      
        ]

        public verifyOtpBody=[
            body("type")
                .notEmpty()
                .withMessage(constant.TYPE_NULL) 
                .isInt({ min: 1, max: 3 }) 
        .withMessage("Type must be between 1 and 3"),      
          
            body("email")
        .notEmpty()
        .withMessage(constant.EMAIL_ERROR)        
        .isEmail().withMessage(constant.WRONG_EMAIL),

        body("mobile")
        .notEmpty()
        .withMessage(constant.Mobile_ERROR) ,
        body("token")
        .notEmpty()
        .withMessage(constant.TOKEN_ERROR)    ,
        body("otp")
        .notEmpty()
        .withMessage(constant.OTP_ERROR)        
      
        ]





}

export default  new userValidation();













































export {}