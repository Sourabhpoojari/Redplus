const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donatedOn : {
        type:Date,
        default:Date.now()
    },
    credits:{
        type:Number,
        default:0
    },
    creditDuration:{
        type:String
    },
    expiryTicket:{
        type:String
    },
    bloodBank :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BloodBank'
    },
    camp:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Camp'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    primaryTest : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'PrimaryTest'
    },
    report:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BloodTestReport'
    }
});

module.exports = mongoose.model('Donation',donationSchema);