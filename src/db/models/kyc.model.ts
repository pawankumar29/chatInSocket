

import { DataTypes,Model } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";
import { Coin } from "./coin.model";

 export const Kyc = sequelize.define('Kyc', {
    
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        aadharNo:{
            type:DataTypes.STRING,
            allowNull:false
        },
        frontImg:{
            type: DataTypes.STRING,
             allowNull:false
        },

        backImg:{
            type: DataTypes.STRING,
             allowNull:false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
              key: 'id', 
            }
  
    },
    status:{
        type: DataTypes.STRING,
         defaultValue:"pending"
    }
}
);








