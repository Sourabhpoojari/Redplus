const mongoose = require('mongooose');

const bloodTestReport= mongoose.Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    typeOfBag:{
        type : String,
        required: true
    },
    quantity:{
        type:Number,
        required : true
    },
    bagNumber:{
        type : String,
        required: true
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
        type: String,
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
    ]
});

module.exports= mongoose.model('BloodTestReport',bloodTestReport);