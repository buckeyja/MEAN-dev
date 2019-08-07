const mongoose = require( 'mongoose' );
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
})

// Method for adding user password. Must be done after schema has been defined and before the model is compiled.
userSchema.methods.setPassword = function (password) {
   // Creates a random string for salt
  this.salt = crypto.randomBytes(16).toString('hex');
  // Creates an encrypted hash
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000, 10),
  }, process.env.JWT_SECRET);
}

mongoose.model('User', userSchema, 'users');