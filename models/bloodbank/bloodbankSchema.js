const mongoose  = require("mongoose");

const bloodbankSchema = new mongoose.Schema({
    bname:{
        type: String,
        required : true,
    },
    btype:{
        type: String,
        required : true,
    },
    baddress:{
        type: String,
        required : true,
    },
    email:{
        type: String,
        required : true,
        unique:true
    },
    phone:{
        type: String,
        required : true,
    },
    password:{
        type: String,
        required :true
    },
    bregnumber:{
        type: String,
        required : true,
        unique:true
    },
    bfile:{
        type:String,
        required : true
    
    },
    baccredation:{
        type:String,
        required : true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});
module.exports = mongoose.model('BloodBank',bloodbankSchema);