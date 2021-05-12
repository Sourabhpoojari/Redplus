const mongoose = require('mongoose');

const hospitalRequestSchema = mongoose.Schema({
  hospitalName:{
      type:String,
      required:true
  },
  hospitalEmail:{
      type:String,
      required:true
  },
  hospitalAddress:{
      type:String,
      required:true
  },
  hospitalPhone:{
      type:String,
      required:true
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
  createdAt :{
    type:Date,
    default:Date.now()
  }
});


module.exports = mongoose.model('HospitalRequest',hospitalRequestSchema);