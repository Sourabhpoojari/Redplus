const mongoose = require('mongoose');

const primarytestedDonor = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bloodbank:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'BloodBank'
    },
    bagNumber:{
        type:String,
        required:true
    },
    createdOn :{
        type:Date,
        default:Date.now()
    }

});

module.exports = mongoose.model('PrimaryTestedDonor',primarytestedDonor);