import User from './user';
import Image from './image';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

const ObjectId = mongoose.Types.ObjectId;
ObjectId.prototype.valueOf = function() {
  return this.toString();
};

const mongooseOpt = {
  autoIndex: false,
  autoReconnect: true,
  reconnectTries: 5,
  reconnectInterval: 1000,
  useNewUrlParser: true,
};

const startDB = uri =>
  mongoose.connect(
    uri,
    mongooseOpt
  );

mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + process.env.MONGODB);
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log(
      'Mongoose default connection disconnected through app termination'
    );
    process.exit(0);
  });
});

const models = {
  User,
  Image,
};
// User.findOne({ username: 'test' }, (err, user) => {
//   if (!user) {
//     const testUser = new User({
//       username: 'test',
//     });
//     testUser.setPassword('pass');
//     testUser.save();
//   }
// });

export { startDB, models };
