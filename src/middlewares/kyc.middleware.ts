import  jwt  from 'jsonwebtoken';
import constant from "../constant/response";
import express from "express";
import { Kyc } from '../db/models/kyc.model';
import { User } from '../db/models/user.model';


async function kycAccessController(req:express.Request|any, res:express.Response, next:express.NextFunction) {
  try {

       const kycData:any=await User.findOne({
            where:{
                email:req.userData.email
            },
            include:[
                {
                    model:Kyc
                }
            ]
       }) ;
       
       if(kycData && kycData.Kyc.status===constant.complete){
                   next();
       }
    else
    throw new Error(constant.Complete_Kyc);
    

    
  } catch (error:any) {
    return res.status(401).json({ message: error.message });
  }
}

async function kycAccessControllerPending(req:express.Request|any, res:express.Response, next:express.NextFunction) {
    try {
  
         const kycData:any=await User.findOne({
              where:{
                  email:req.userData.email
              },
              include:[
                  {
                      model:Kyc
                  }
              ]
         }) ;
         
         if(kycData && (kycData.Kyc.status===constant.failed)){
                     next();
         }
      else
      throw new Error(constant.Kyc_Pending);
      
  
      
    } catch (error:any) {
      return res.status(401).json({ message: error.message });
    }
  }

async function adminAccessController(req:express.Request|any, res:express.Response, next:express.NextFunction) {
    try {
         const userData:any=await User.findOne({
              where:{
                  email:req.userData.email
              }
             
         }) ;
         
         if(userData.type==2){
                     next();
         }
      else
      throw new Error(constant.Access_Not_Allowed);
      
  
      
    } catch (error:any) {
      return res.status(401).json({ message: error.message });
    }
  }
export {kycAccessController,adminAccessController,kycAccessControllerPending};
