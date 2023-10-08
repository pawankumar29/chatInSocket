

import { DataTypes,Model } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model"; 
import messages from "../models/message.model"
import { room } from "./room.model";

 export const participant = sequelize.define('participant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
        allowNull: false,
    references: {
        model: User,
      key: 'id', 
    }
},

  roomId: {
    type: DataTypes.INTEGER,
        allowNull: false,
    references: {
        model: room,
      key: 'id', 
    }
}
  
    
},


);