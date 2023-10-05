

import { DataTypes } from "sequelize";
import sequelize from "../sequelize";
import {Password } from "./password.model"
import { Wallet } from "./wallet.model";



 export const Coin = sequelize.define('Coin', {
    coinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    coinName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coinSymbol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   
    coinFamily: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coinStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'active'
    },
    isToken: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },

  
    tokenAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },


});



  
    