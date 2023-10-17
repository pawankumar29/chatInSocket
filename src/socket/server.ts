import { Server } from 'socket.io';
import { room } from '../db/models/room.model';
import { participant } from '../db/models/participant.model';
import messages from '../db/models/message.model';

export const initializeSocketServer = (httpServer: any) => {
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('A user connected in server');


        //join user api

        socket.on('join', async (msg) => {
            console.log("in app.js calling join", msg);

            try {

                const roomExist: any = await room.findOne({
                    where: {
                        name: msg.room
                    }
                });



                if (!roomExist) {
                    const roomData = {
                        name: msg.room,    
                        type: msg.type      
                    }
                    const roomCreate: any = await room.create(roomData);
                    console.log("roomCreate===>",roomCreate);
                    const participantDataToStore = {
                        userId: msg.userId,
                        roomId: roomCreate.id
                    }



                    const participantData = await participant.create(participantDataToStore)


                    socket.emit('join', msg);   //for checking to webview 
                }
                else {

                    const participantExist = await participant.findOne({
                        where: {
                            userId: msg.userId,
                            roomId: roomExist.id
                        }
                    })

                    if (participantExist) {
                        console.log(`user id ${msg.userId} exist already`)
                    }
                    else {
                        const participantDataToStore = {
                            userId: msg.userId,
                            roomId: roomExist.id
                        }
                        const participantData = await participant.create(participantDataToStore)

                    }
                    //  //code for testing 
                    //  socket.join(msg.room);
                    //  io.to(socket.id).emit('join', msg); // only while checking frontend for me 
                    //  //over

                    console.log("errorInJoin==room exist ALREADY",)
                }



            } catch (error) {
                console.log("errorInJoin-->", error);
            }


        })





        //  Socket.IO event handlers

        socket.on('chat', async (msg) => {
            console.log("in app.jscalling", msg);

            try {

                //--------------------
                const roomExist:any=await room.findOne({
                    where:{
                        name:msg.room
                    }                                     // only while checking for frontend
                });

                msg.roomId=roomExist.id;

                  // if the participant to is not added in the roomId

                  const checkParticipant=await participant.findOne({
                     where:{
                        roomId:msg.roomId,
                        userId:msg.to
                     }
                  })

                  if(!checkParticipant){
                    await participant.create({ roomId:msg.roomId,
                        userId:msg.to});
                        
                  }

                //------------------------------------------------------------
                const messageData = await messages.create(msg);

                console.log("message", messageData);
                socket.emit('chat', msg);

                return messageData;
            } catch (error) {

                console.log("errorInChat", error)

            }
        })

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
