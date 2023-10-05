
import {body} from 'express-validator';

import constant from '../../constant/response';


class socketValidation{

   
    public chatBody=[
        body("text")
        .notEmpty()
        .withMessage(constant.NO_MESSAGE),
    
    ]




}

export default  new socketValidation();













































export {}