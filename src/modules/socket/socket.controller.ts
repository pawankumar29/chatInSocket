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
          email: req.userData.email,
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

          await room.create({ name: randomRoom, type: 'single' });

          socket.emit('join', { room: randomRoom, type: 'single', userId: senderId });



          const data = {
            from: senderId,
            to: receiverId,
            message: message,
            room: randomRoom
          }

          setTimeout(() => {
            socket.emit('chat', data);
          }, 1000);





        }
        else {
          // if room found with the same room 
          console.log("rook===>", roomId);
          const findRoom: any = await room.findOne({
            where: {
              id: roomId
            }
          })
          console.log("findRoom===>", findRoom)
          const data = {
            from: senderId,
            to: receiverId,
            message: message,
            room: findRoom.name
          }

          socket.emit('chat', data);


        }
      }
      else {
        throw { message: "no user present " }
      }



      res.json({ status: 1, data: "message sent successfully " });

    } catch (error: any) {
      console.log("error==>", error);
      res.json({ status: 0, error: error.message || error })
    }
  }



  userLatestChat = async (req: express.Request | any, res: express.Response | any, next: express.NextFunction) => {
    try {
      const userId = req.userData.userId;
      const email = req.body.other_user_email;
      let finalArr: any = [];

      const checkSenderExistWithRoom: any = await User.findOne({
        where: {
          id: userId,
        },
        include: {
          model: participant,
        }
      });

      const arr2 = checkSenderExistWithRoom.participants;
      let senderArray: any = [];

      senderArray = arr2.map((ele: any) => {
        return ele.roomId;
      });


      let arr1: any = [];

      for (const e of senderArray) {
        const userData: any = await participant.findOne({
          where: {
            roomId: e,
            userId: {
              [Op.ne]: userId,
            },
          },
          attributes: ["userId"]
        });

        if (userData) {
          arr1.push(userData.userId);

          for (const id of arr1) {

            const userDetails: any = await User.findOne({
              where: {
                id: id
              }
            })
            const userDataWithMessage: any = await messages.findAll({
              where: {
                [Op.or]: [
                  {
                    [Op.and]: [
                      { from: userId },
                      { to: id },
                    ],
                  },
                  {
                    [Op.and]: [
                      { to: userId },
                      { from: id },
                    ],
                  },
                ]
              },
              order: [['createdAt', 'DESC']],
              limit: 1,

            });


            if (userDataWithMessage.length > 0 && userDetails) {
              const data = {
                email: userDetails.email,
                name: userDetails.name,
                message: userDataWithMessage[0].message
              }
              const exists = finalArr.some((uniqueItem: any) => uniqueItem.email === data.email);
              if (!exists)
                finalArr.push(data);
            }
          }
        }
      }



      res.json({ status: 1, msg: "user chats", data: finalArr });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ status: false, error: error.message || error });
    }
  }

}


export default new socketHelper();