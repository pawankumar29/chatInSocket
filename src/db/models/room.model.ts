
import { DataTypes,Model } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model"; 
import messages from "../models/message.model"

 export const room = sequelize.define('room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  type:{
    type: DataTypes.STRING,
    allowNull: false,

  }
  
    
},


);

// console.log("message--->",messages);

// room.hasMany(messages, { foreignKey: 'roomId' });
// messages.belongsTo(room, { foreignKey: 'roomId' });
