const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    middleName:{
        type: String,

    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    Role:{
        type:String,
        required:true,

    },
    Department:{
        type:String,
        required:true,

    } ,
    password:{
        type: String,
        required: true
    },
    CreatedTime:{
        type: Date,
        default: Date.now
    },
    
  }
  ,
{timestamps:true}
  );
  const User = mongoose.model('user', UserSchema);
  module.exports = User;