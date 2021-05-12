const mongoose = require('mongoose');

const Hprofileschema = mongoose.Schema({
    hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital'
    },
    hospitalName:{
        type:String,
        requirred:true
    },
    hospitalEmail:{
        type:String,
        requirred:true
    },
    hospitalAddress:{
        type:String,
        requirred:true
    },
    hospitalPhone:{
        type:String,
        requirred:true
    },
    hospitalRegistrationNumber:{
        type:String,
        required:true
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point']// 'location.type' must be 'Point'
        // required: true
      },
      // type:Point,
      coordinates: {
        type: [Number],
        required: true
      }
    },
    hospitalRegistrationDocument:{
        type:String
    },
    hprofileCreatedAt:{
        type:Date,
        default:Date.now()
    }

});

module.exports = mongoose.model('HospitalProfile',Hprofileschema);