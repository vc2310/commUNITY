import mongoose, { Schema } from 'mongoose';
const crypto = require('crypto');
const Token = require('./Token');
const jwt = require('jsonwebtoken');

// Define user schema
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    address: {
      city: String,
      province: String,
      country: String
    },
    email: String,
    hash: String,
    salt: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    isCM: {
      type: Boolean,
      default: false
    }
});

userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    address: this.address,
    isCM: this.isCM,
    token: this.generateJWT(),
  };
};

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

userSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}
// Export Mongoose model
export default mongoose.model('user', userSchema);
