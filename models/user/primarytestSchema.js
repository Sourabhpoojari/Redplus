const mongoose= require('mongoose');

const primarytestReport=({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bloodbank:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bloodbank'
    },
    weight : {
        type:Number,
        required:true
    },
    pulse : {
        type: Number,
        required:true
    },
    hb :{
        type : Number,
        required:true
    },
    bp :{
        type : Number,
        required:true
    },
    tempreture :{
        type : Number,
        required : true
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('primarytestr eport',primarytestReport);