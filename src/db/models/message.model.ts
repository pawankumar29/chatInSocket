
import { DataTypes,Model } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model"; 
import { room } from "./room.model";

  const messages = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true, // Allow null for messages with file uploads
  },

  from: {
    type: DataTypes.INTEGER,
    allowNull: false,
references: {
    model: User,
  key: 'id', 
}
  },
  to: {
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

});


export default messages;