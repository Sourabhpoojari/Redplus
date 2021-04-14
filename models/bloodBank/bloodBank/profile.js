const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    bloodBank:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BloodBank'
    },
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
        required:true,
        unique:true
    },
    bloodBankRegistrationNumber:{
        type:String,
        required:true
    },
    location: {
      type: {
        type: "String",
        default:"Point" // Don't do `{ location: { type: String } }`
        // 'location.type' must be 'Point'
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
    profileCreatedAt:{
        type:Date,
        default:Date.now()
    }
});
profileSchema.index({ location: "2dsphere" });

module.exports  = mongoose.models.BloodBankProfile || mongoose.model('BloodBankProfile',profileSchema);