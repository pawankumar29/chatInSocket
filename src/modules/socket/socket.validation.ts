
import {body} from 'express-validator';

import constant from '../../constant/response';


class socketValidation{

   
    public chatBody=[
        body("message")
        .notEmpty()
        .withMessage(constant.NO_MESSAGE),
        body("receiver_email")
        .notEmpty()
        .withMessage(constant.NO_PARAM),
    
    ]
    public joinBody=[
        body("room")
        .notEmpty()
        .withMessage(constant.NO_ROOM),
        body("type")
        .notEmpty()
        .withMessage(constant.NO_TYPE),
    
    ]





}

export default  new socketValidation();













































export {}