
import { DataTypes } from "sequelize";
import sequelize from "../sequelize";
import {Password } from "./password.model"
import { Wallet } from "./wallet.model";
import { Kyc } from "./kyc.model";
import { picture } from "./picture.model";
import { messages } from "./message.model";



 export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
  age:{
    type:DataTypes.INTEGER,
    allowNull:false,

  },
  otp:{
    type:DataTypes.INTEGER,
    allowNull:true,

  },
  mobile:{
    type:DataTypes.STRING,
    allowNull:false,
    // unique:true

  },
 
  status:{
    type:DataTypes.INTEGER,
    defaultValue:5

  },

  type:{
    type:DataTypes.INTEGER,
    defaultValue:1                   //1 =user 2=admin
  }


});

 User.hasOne(Password, { foreignKey: 'userId' });
 Password.belongsTo(User, { foreignKey: 'userId' });




 User.hasOne(Wallet, { foreignKey: 'userId' });
 Wallet.belongsTo(User, { foreignKey: 'userId' });


 User.hasOne(Kyc, { foreignKey: 'userId' });
 Kyc.belongsTo(User, { foreignKey: 'userId' });

 User.hasOne(picture, { foreignKey: 'userId' });
 picture.belongsTo(User, { foreignKey: 'userId' });



