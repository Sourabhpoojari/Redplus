const mongoose = require('mongoose');

const userRequestSchema = mongoose.Schema({
    donor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bloodbank:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'BloodBank'
    },
    createdOn :{
        type:Date,
        default:Date.now()
    }

});

module.exports = mongoose.model('DonorRequest',userRequestSchema);