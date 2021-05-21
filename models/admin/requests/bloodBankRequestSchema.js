const mongoose = require('mongoose');

const bloodBankRequestSchema = mongoose.Schema({
  bloodBankName:{
      type:String,
      required:true
  },
  bloodBankEmail:{
      type:String,
      required:true, 
      unique:true
  },
  bloodBankAddress:{
      type:String,
      required:true
  },
  bloodBankPhone:{
      type:String,
      required:true
  },
  bloodBankRegistrationNumber:{
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
  bloodBankRegistrationDocument:{
      type:String
  },
  createdAt :{
    type:Date,
    default:Date.now()
  }
});


module.exports = mongoose.model('BloodBankRequest',bloodBankRequestSchema);