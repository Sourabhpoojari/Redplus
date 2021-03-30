const mongoose= require('mongoose');

const primarytestReport=({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    weight : {
        type:String,
        required:true
    },
    pulse : {
        type: String,
        required:true
    },
    hb :{
        type : String,
        required:true
    },
    bp :{
        type : String,
        required:true
    },
    tempreture :{
        type : String,
        required : true
    }
});

module.exports = mongoose.model('primarytestr eport',primarytestReport);