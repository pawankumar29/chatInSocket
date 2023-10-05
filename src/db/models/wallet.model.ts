
import { DataTypes,Model } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";
import { Coin } from "./coin.model";

 export const Wallet = sequelize.define('Wallet', {
    
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
       
        walletAddress: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        coinId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Coin,
          key: 'coinId', 
        },
        },
        balance: {
          type: DataTypes.DOUBLE,
          defaultValue: 0

        },
        status: {
            type: DataTypes.STRING,
          defaultValue: 'inActive'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
              key: 'id', 
            },
      },
    }
);


Wallet.hasMany(Coin,{foreignKey:'coinId'});
Coin.belongsToMany(Wallet,{through:'coinId'});


