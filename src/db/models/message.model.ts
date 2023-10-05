
import { DataTypes,Model } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model"; 

 export const messages = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true, // Allow null for messages with file uploads
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING, // Store the file/image reference
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
        allowNull: false,
    references: {
        model: User,
      key: 'id', 
    }
}

});


