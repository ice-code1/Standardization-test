const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, 
     required: false,
     unique: true 
    },

  email:{
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },

  temp_secretKey: {
    type:String,
    ascii: String,
    hex: String,
    base32: String,
    otpauth_url: String
  },

  token: {
    type:String,
  },

  image: {
    data: Buffer,
    contentType: String
  }  
})

const User = mongoose.model('new_2users', UserSchema);
module.exports = User
