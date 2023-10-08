import express from 'express'
import messages from '../../db/models/message.model'
import { User } from '../../db/models/user.model'
import socket from '../../socket/client'
import * as constant from "../../constant/response"
import sequelize from '../../db/sequelize'
import { Sequelize } from 'sequelize';
import { participant } from '../../db/models/participant.model'
import { room } from '../../db/models/room.model'
import { Op } from 'sequelize';


class socketHelper {
  

   

  uploadChat = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
  ) => {
    try {
      let data: any;
      const { roomName, message, sender } = req.body;
      const userId = req.userData.userId;
      // console.log("userrrr--->",userId);


      const roomData: any = await room.findOne({
        where: {
          name: roomName
        }
      })

      if (roomData) {
        const participants: any = await participant.findAll({
          where: {

            roomId: roomData.id,
            userId: {
              [Op.ne]: userId
            }

          }
        });
        console.log("party-->", participants)

        participants.forEach((element: any) => {
          if (sender) {
            data = {
              from: userId,
              to: element.userId,
              message: message,
              roomId: element.roomId

            }
          }
          else {
            throw { message: "no sender" }
// not for user receiving the message 
            // data = {
            //   from: element.userId,
            //   to: userId,
            //   message: message,
            //   roomId: element.roomId

            // }

          }
          socket.emit('chat', data);
        });

        return res.status(200).json({ status: true, message: 'Chat message sent successfully' });

      }
      else
        throw { message: "no room data" }

    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ status: false, error: error.message || error });
    }
  }


  uploadFile = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
  ) => {
    try {
      const user: any = await User.findOne({
        where: {
          email: req.userData.email
        }
      })

      if (user && user.status == 3) {
        const message = {
          sender: user.email,
          userId: user.id,
          filePath: req.file.path,
        };
        await messages.create(message);
        socket.emit('fileUploaded', message);
        return res.status(200).json({ status: true, message: 'File uploaded successfully' });
      }
      else
        throw { message: "Invalid User" };

    } catch (error: any) {
      return res.status(500).json({ status: false, error: error.message || error });
    }
  }

  joinChat = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
  ) => {
    try {
      const userId = req.userData.userId; // replace it with the req.userData.userId

      const { type, room } = req.body;


      const user: any = await User.findOne({
        where: {
          email: req.userData.email
        }
      })

      if (!user) throw { message: constant.default.USER_NOT_Found };
      if (user.status != 3) throw { message: constant.default.Kyc_Pending };


      socket.emit('join', { room: room, type: type, userId: userId });

      // add the participants 

      res.json({ status: 1, msg: "user Joined Successfully" });


    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ status: false, error: error.message || error });
    }
  }


  userChatList = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
    ) => {
      try {
        const userId = req.userData.userId; // replace it with the req.userData.userId
  
  
  
        const userData: any = await messages.findAll({
          where: {
           [ Op.or]:{
               to:userId,
               from:userId
            }
          }
        })
  
  
  
        // add the participants 
  
        res.json({ status: 1, msg: "user chats" ,data:userData});
  
  
      } catch (error: any) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message || error });
      }
    }

    userLatestChat = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
      ) => {
        try {
          console.log("in chat latest",req.userData)
          const userId = req.userData.userId;
    
    
          const userData = await messages.findAll({
            where: {
              [Op.or]: [
                { to: userId },
                { from: userId }
              ]
            },
            order: [['createdAt', 'DESC']], 
            limit: 1 
          });
    
    
    
          // add the participants 
    
          res.json({ status: 1, msg: "user chats" ,data:userData});
    
    
        } catch (error: any) {
          console.log(error);
          return res.status(500).json({ status: false, error: error.message || error });
        }
      }

}


export default new socketHelper();