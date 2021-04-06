const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
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


module.exports = mongoose.model('Hospital',hospitalSchema);