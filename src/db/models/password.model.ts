
import { DataTypes,Model } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model"; 

 export const Password = sequelize.define('Password', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  privateKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
      key: 'id', 
    },
  },
});



