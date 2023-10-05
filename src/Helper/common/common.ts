import bcrypt from "bcrypt"
import   multer from "multer"
import  * as fs from "fs";
import * as path from "path";
import {imageSize} from 'image-size'

export async function generateHash(password: any) {
    try {
        const saltRounds: any = process.env.saltRounds;
        const hashPassword = await bcrypt.hash(password, Number(saltRounds));
        return hashPassword;
    } catch (error) {
        console.log("errorInHashPassword", error);

        return false;
    }


}


export async function compareHashedPassword(password: any, hash: any) {
    try {
        const saltRounds = process.env.saltRounds;
        const hashPassword = await bcrypt.compare(password, hash);
        return hashPassword;
    } catch (error) {
        console.log("errorInHashedPassword", error);

        return false;
    }


}



export const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        // where you want to keep the data
        cb(null, 'public');
      },
      filename: function (req, file, cb) {
      
        cb(null, file.fieldname + "-" + Date.now() + ".txt");
      },
      
    }),
    // fileFilter: function (req:any, file, cb) {
       
    //   const size=5;

    //     const allowedExtensions = ['.csv','.png','.jpg','.jpeg','.txt'];
    //     const imgExtension=['jpg','jpeg','png'];
       
   


    //     const fileExtension = path.extname(file.originalname).toLowerCase();
    
    //     if (!allowedExtensions.includes(fileExtension)) {
    //       req.fileValidationError = "Forbidden extension";
    //       // return cb(null, false, req.fileValidationErro);
    //       cb(null, true);

    //     }
      
    //     // if(imgExtension.includes(orgExt)){
    //     //   const dimension:any=imageSize(new Buffer(file.path));
    //     //   const maxWidth=800;
    //     //   const maxHeight=600;

    //     //   if(dimension.width>maxWidth||dimension.height>maxHeight){
    //     //     cb(new Error(`kindly enter image with proper size `));

    //     //   }

    //     // }
        
    //     cb(null, true);

    // }
    })

//   