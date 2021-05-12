const mongoose = require('mongoose');

const bloodTestReport= mongoose.Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bloodBank:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BloodBank'
    },
    bagNumber:{
        type:String,
        required:true
    },
    bgroup :{
        type : String
    },
    rbcCount:{
        type: Number
    },
    wbcCount:{
        type: Number
    },
    plateCount:{
        type : Number
    },
    hemoglobinCount:{
        type : Number
    },
    hematocrit:{
        type: Number
    },
    bglucose:{
        type: Number
    },
    bp:{
        systrolic :{type:Number},
        diastolic:{type:Number}
    },
    diseases :[
        {
            type:String
        }
    ],
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

module.exports= mongoose.model('BloodTestReport',bloodTestReport);