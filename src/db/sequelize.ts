

import { Sequelize } from 'sequelize-typescript';
import * as dotenv from "dotenv"
dotenv.config();

// console.log(process.env.dbName);
const sequelize = new Sequelize({
  database: process.env.dbName,
  username: process.env.username,
  password: process.env.password,
  dialect:  'mysql',
  logging:false
});
 sequelize.sync({force:false}).then(() => {
  console.log('sync has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
sequelize.authenticate().then(() => {
  console.debug(`${ process.env.dbName} DB Connection has been established successfully.`);
}).catch((error: any) => {
  console.error(`${ process.env.dbName} DBUnable to connect to the database: ${ process.env.dbName}`, error);
});

export default sequelize;
