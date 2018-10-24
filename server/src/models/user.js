import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
  },
  hash: String,
  salt: String,
});
UserSchema.index({
  username: 'text',
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
    .toString('hex');
};
UserSchema.methods.validPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function(days = 1) {
  // set expiration to 1 day
  const today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + days);
  const payload = {
    _id: this._id,
    username: this.username,
    exp: Math.round(exp.getTime() / 1000) || 0,
  };
  return jwt.sign(payload, process.env.SECRET);
};

export default mongoose.model('User', UserSchema, 'users');
