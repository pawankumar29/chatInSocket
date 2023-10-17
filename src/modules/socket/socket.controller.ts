import express from 'express'
import messages from '../../db/models/message.model'
import { User } from '../../db/models/user.model'
import socket from '../../socket/client'
import * as constant from "../../constant/response"
import sequelize from '../../db/sequelize'
import { Model, Sequelize } from 'sequelize';
import { participant } from '../../db/models/participant.model'
import { room } from '../../db/models/room.model'
import { Op } from 'sequelize';
import randomString from "randomstring"


class socketHelper {




  uploadChat = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
  ) => {
    try {

      const { receiver_email, message } = req.body;


      // check user exist in the contact list of user with room id

      const checkReceiverExistWithRoom: any = await User.findOne({
        where: {
          email: receiver_email,
        },
        include: {
          model: participant,
        }
      });

      // check sender exist with the room id

      const checkSenderExistWithRoom: any = await User.findOne({
        where: {
          email: "pk1532@gmail.com",
        },
        include: {
          model: participant,
        }
      });

      let roomId;

      let receiverArray: any = [];
      let senderArray: any = [];

      // case to check if participant room exist
      if (checkReceiverExistWithRoom) {
        const arr1 = checkReceiverExistWithRoom.participants;
        const arr2 = checkSenderExistWithRoom.participants;

        // checking if same roomid exist for both

        receiverArray = arr1.map((ele: any) => {
          return ele.roomId;
        }
        )


        senderArray = arr2.map((ele: any) => {
          return ele.roomId;
        }
        )

        receiverArray.forEach((e: any) => {
          senderArray.forEach((e1: any) => {
            if (e === e1)
              roomId = e;
          })
        })

        const receiverId = checkReceiverExistWithRoom.id;
        const senderId = checkSenderExistWithRoom.id;

        if (!roomId) {  // if receiver and sender are not in the same room 



          const randomRoom = randomString.generate({
            length: 12,
            charset: 'alphabetic'
          });

         await  room.create({name: randomRoom, type: 'single'});

          socket.emit('join', { room: randomRoom, type: 'single', userId: senderId });

       

          const data = {
            from: senderId,
            to: receiverId,
            message: message,
            room: randomRoom
          }

                   setTimeout(()=>{
                  socket.emit('chat', data);
                   },1000);





        }
        else {
          // if room found with the same room 
           console.log("rook===>",roomId);
          const findRoom: any = await room.findOne({
            where: {
              id: roomId
            }
          })
             console.log("findRoom===>",findRoom)
          const data = {
            from: senderId,
            to: receiverId,
            message: message,
            room: findRoom.name
          }

                   socket.emit('chat', data);


        }
      }
      else{
          throw {message:"no user present "}
      }



      res.json({ status: 1, data: "message sent successfully " });

    } catch (error: any) {
      console.log("error==>", error);
      res.json({ status: 0, error: error.message || error })
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

  // all user chats irrespective of the users 
  userChatList = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
  ) => {
    try {
      const userId = req.userData.userId; // replace it with the req.userData.userId



      const userData: any = await messages.findAll({
        where: {
          [Op.or]: {
            to: userId,
            from: userId
          }
        }
      })



      // add the participants 

      res.json({ status: 1, msg: "user chats", data: userData });


    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ status: false, error: error.message || error });
    }
  }

  userLatestChat = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
  ) => {
    try {
      const userId = req.userData.userId;
      const email = req.body.other_user_email

      const senderUser: any = await User.findOne({
        where: {
          email: email
        }
      })


      if (senderUser) {
        const sender: any = senderUser.id


        const userData = await messages.findAll({
          where: {
            [Op.or]: [
              {
                [Op.and]: [
                  { from: userId },
                  { to: sender },
                ],
              },
              {
                [Op.and]: [
                  { to: userId },
                  { from: sender },
                ],
              },
            ]

          },

          order: [['createdAt', 'DESC']],
          limit: 1
        });





        // add the participants 

        res.json({ status: 1, msg: "user chats", data: userData });
      }
      else
        throw { message: 'no other user avalibale ' }


    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ status: false, error: error.message || error });
    }
  }

  // all the connected user to the user
  myChatList = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
  ) => {
    try {
      const userId = req.userData.userId; // replace it with the req.userData.userId


      console.log("userId", userId);
      const userData: any = await messages.findAll({
        where: {
          [Op.or]: [{
            to: userId
          },
          { from: userId }

          ]

        },

        include: [
          {
            model: User,
            attributes: ["name", "email", "age", "mobile", "id"],
            where: {
              id: { [Op.not]: userId },
            },
          }],

        attributes: [["name", "user.name"], ["email", "user.email"], ["age", "user.age"], ["mobile", "user.mobile"]],
        group: ["User.id"]

      })

      console.log("userdata", userData);

      const result = [];

      for (const item of userData) {
        const user = item.User;
        result.push(user);
      }

      res.json({ status: 1, msg: "user chats", data: result });


    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ status: false, error: error.message || error });
    }
  }

  chooseUser = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction
  ) => {
    try {
      const userId = req.userData.userId; // replace it with the req.userData.userId

      const otherUser: any = req.body.otherUser;

      const { roomName, type } = req.body;
      otherUser.toLowerCase();

      const findUser: any = await User.findOne({
        where: {
          [Op.or]: [
            { email: otherUser },
            { mobile: otherUser }
          ]
        }
      });


      const roomExist: any = await room.findOne({
        where: {
          [Op.or]: [
            { email: otherUser },
            { mobile: otherUser }
          ]
        }
      });

      if (findUser) {
        socket.emit('join', { room: room, type: type, userId: findUser.id });
        socket.emit('join', { room: room, type: type, userId: userId })

        res.json({ status: 1, msg: "User successfullly added and ready to chat " })
      }
      else
        throw { message: 'no user found Kindly enter another user ' }




    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ status: false, error: error.message || error });
    }
  }
}


export default new socketHelper();