const mongoose = require('mongoose');

const wholeSchema = mongoose.Schema({
    bankID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'bloodBank'
    },
    donor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    group:{
        type:String,
        required:true
    },
    batch:{
        type:String
    },
    segment:{
        type:String,
        unique:true
    },
    duration:{
        type:String

    },
    ticket:{
        type:String 
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('WHOLE',wholeSchema);