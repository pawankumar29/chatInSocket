import express from 'express'
import { messages } from '../../db/models/message.model'
import { User } from '../../db/models/user.model'
import { io } from '../../../app'



class socketHelper{
  
    uploadChat = async (req: express.Request|any, res: express.Response|any, next: express.NextFunction
        )=>{
            try {
                const user:any=await User.findOne({
                 where:{
                  //  email:req.userData.email
                  email:"pk3@gmail.com"
                 }
                })
           
               const { text} = req.body;
              //  console.log("sdjfjdsfjdsfds--->",req.userData.email)
              //  console.log("sdjfjdsfjdsfds--->",user)

               if(user&&user.status==3){
              const t= await messages.create({ text:text, sender: user.email,userId:user.id });
               io.emit('chat message', { text:text, sender: user.email,userId:user.id });
               return res.status(200).json({ status:true,message: 'Chat message sent successfully' });
               }
               else 
               throw {message:"Invalid User"};
              } catch (error:any) {
                console.log(error);
               return res.status(500).json({status:false, error: error.message || error});
             }
        }


    uploadFile = async (req: express.Request|any, res: express.Response|any, next: express.NextFunction
        )=>{
            try {
                // console.log("req-->",req.file);
                const user:any=await User.findOne({
                  where:{
                    email:req.userData.email
                  }
                 })
                
                 if(user&&user.status==3){
                const message = {
                   sender: user.email,
                   userId:user.id ,
                  filePath: req.file.path,
                };
                 await messages.create(message);
                 io.emit('fileUploaded', message);
                return res.status(200).json({status:true, message: 'File uploaded successfully' });
              }
              else
              throw {message:"Invalid User"};

              } catch (error:any) {
                return res.status(500).json({ status :false,error: error.message || error });
              }
        }



}


export default new socketHelper();