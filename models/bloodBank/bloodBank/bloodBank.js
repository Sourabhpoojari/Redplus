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
    createdAt:{
        type:Date,
        default:Date.now()
    }
});


module.exports = mongoose.model('BloodBank',bloodBankSchema);