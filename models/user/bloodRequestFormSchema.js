const mongoose = require('mongoose');

const bloodRequest= mongoose.Schema({
    donor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bloodBank:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BloodBank'
    },
    createdOn:{
        type:Date,
        default:Date.now()
    },
    pattientName:{
        type:String
    },
    hospitalName:{
        type: String
    },
    age:{
        type:Number
    },
    bloodGroup:{
        type:String
    },
    wbc:{
        type:Number
    },
    wholeBlood:{
        type:Number
    },
    platelet:{
        type:Number
    },
    plasma:{
        type:Number
    },
    sdPlatelet:{
        type:Number
    },
    prbc:{
        type:Number
    },
    ffp:{
        type:Number
    },
    cryo:{
        type:Number
    },
    sprbc:{
        type:Number
    },
    sdPlasma:{
        type:Number
    }
});


module.exports= mongoose.model('BloodRequestForm',bloodRequest);