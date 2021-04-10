const mongoose = require('mongoose');

const ffpSchema = mongoose.Schema({
    bankID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'bloodBank'
    },
    donor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    batch:{
        type:String
    },
    segment:{
        type:String
    },
    group:{
        type:String,
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('FFP',ffpSchema);