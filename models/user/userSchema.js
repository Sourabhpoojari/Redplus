const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:  String
    },
    phone: {
        type:String
    },
    password:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('User',userSchema);