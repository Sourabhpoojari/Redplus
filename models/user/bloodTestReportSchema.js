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
    typeOfBag:{
        type : String,
        required: true
    },
    quantity:{
        type:Number,
        required : true
    },

    bgroup :{
        type : String,
        required : true
    },
    batch:{
        type: String,
        required : true
    },
    segNumber:{
        type: Number,
        required : true
    },
    expdate:{
        type: Date,
        required : true
    },
    rbcCount:{
        type: Number,
        required:true
    },
    wbcCount:{
        type: Number,
        required :true
    },
    plateCount:{
        type : Number,
        required : true
    },
    hemoglobinCount:{
        type : Number,
        required : true
    },
    hematocrit:{
        type: Number,
        required : true
    },
    bglucose:{
        type: Number,
        required: true
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