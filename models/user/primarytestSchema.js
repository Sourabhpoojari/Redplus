const mongoose= require('mongoose');

const primarytestReport=({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
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
    }
});

module.exports = mongoose.model('primarytestr eport',primarytestReport);