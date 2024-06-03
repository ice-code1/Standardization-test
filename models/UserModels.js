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

  token: {
    type:String,
    ascii: String,
    hex: String,
    base32: String,
    otpauth_url: String,
    unique:true
  },

  temp_secretKey: {
    type:String,
  },  
  image:{
    filename: {
      type: String
    },
    content: {
      type: String // Base64 string
    }
  }
  
},
{
  timestamps: true
})

const User = mongoose.model('iomns', UserSchema);

module.exports = User

