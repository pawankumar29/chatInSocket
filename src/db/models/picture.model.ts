

import { DataTypes } from "sequelize";
import sequelize from "../sequelize";
import {Password } from "./password.model"
import { Wallet } from "./wallet.model";
import { User } from "./user.model";



 export const picture = sequelize.define('Picture', {
    pictureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fieldName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
            allowNull: false,
        references: {
            model: User,
          key: 'id', 
        }
    },


});







  
    