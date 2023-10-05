import  jwt  from 'jsonwebtoken';
import constant from "./src/constant/response";
import express from "express";
import { Socket } from 'socket.io';


function authController(req:express.Request|any, res:express.Response, next:express.NextFunction) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: constant.AUTH_ERROR });
  }

  try {

    const secret:String|any=process.env.secret;
    const decoded:any= jwt.verify(token, secret); 
    // console.log("d---->",decoded);

    if(decoded.status)
    req.userData= decoded;
    
    else
    throw new Error(constant.User_Not_Active);
    

    next();
  } catch (error:any) {
    return res.status(401).json({ message: error.message });
  }
}



export default authController;
