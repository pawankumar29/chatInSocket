// associations.js
import { room } from './src/db/models/room.model';
import messages from './src/db/models/message.model';
import { User } from './src/db/models/user.model';
import { Wallet } from './src/db/models/wallet.model';
import { Kyc } from './src/db/models/kyc.model';
import { Password } from './src/db/models/password.model';
import { picture } from './src/db/models/picture.model';
import { participant } from './src/db/models/participant.model';


 User.hasMany(messages, { foreignKey: 'from' });
 messages.belongsTo(User, { foreignKey: 'from' });

 User.hasMany(messages, { foreignKey: 'to' });
 messages.belongsTo(User, { foreignKey: 'to' });

 User.hasOne(Password, { foreignKey: 'userId' });
 Password.belongsTo(User, { foreignKey: 'userId' });

 User.hasOne(Wallet, { foreignKey: 'userId' });
 Wallet.belongsTo(User, { foreignKey: 'userId' });


 User.hasOne(Kyc, { foreignKey: 'userId' });
 Kyc.belongsTo(User, { foreignKey: 'userId' });

 User.hasOne(picture, { foreignKey: 'userId' });
 picture.belongsTo(User, { foreignKey: 'userId' });

 User.hasMany(participant, { foreignKey: 'userId' });
 participant.belongsTo(User, { foreignKey: 'userId' });

 room.hasMany(participant, { foreignKey: 'roomId' });
 participant.belongsTo(room, { foreignKey: 'roomId' });

 room.hasMany(messages, { foreignKey: 'roomId' });
messages.belongsTo(room, { foreignKey: 'roomId' });