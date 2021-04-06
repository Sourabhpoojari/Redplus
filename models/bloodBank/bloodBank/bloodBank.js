const mongoose = require('mongoose');

const bloodBankSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    isBloodBank:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});


module.exports = mongoose.model('BloodBank',bloodBankSchema);