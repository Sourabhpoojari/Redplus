const mongoose = require('mongoose');

const sagmSchema = mongoose.Schema({
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
        type:String
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('sagm',sagmSchema);