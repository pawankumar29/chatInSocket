

import express from "express";
import * as constant from "../../constant/response"

async function checkKyc(req:express.Request|any, res:express.Response, next:express.NextFunction) {
    try {
           if(req.userData.status===3){
            next();
           }
      else
      throw new Error(constant.default.Complete_Kyc);
      
  
      
    } catch (error:any) {
      return res.status(401).json({ message: error.message });
    }
  }

  export {checkKyc}