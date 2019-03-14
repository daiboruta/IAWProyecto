import mongoose from 'mongoose';

const Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

let User = new Schema({

    name: {
      
      type: String,
      unique: true,
      required: true
    },
    
    hash: String,
    
    salt: String
});

User.methods.setPassword = function(password) {
    
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

User.methods.validPassword = function(password) {
    
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    
    return this.hash === hash;
};

User.methods.generateJwt = function() {
    
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({

        _id: this._id,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, "SECRET_VAR");
};

export default mongoose.model('User', User);