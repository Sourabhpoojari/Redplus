const mongoose = require('mongoose');

const bloodTestReport= mongoose.Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bloodbank:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bloodbank'
    },
    bagNumber:{
        type:String,
        required:true
    },
    bgroup :{
        type : String
    },
    batch:{
        type: String
    },
    segNumber:{
        type: Number,
    
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
    anyDiseases :[
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