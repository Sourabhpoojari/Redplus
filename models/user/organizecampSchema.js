const mongoose = require('mongoose');

const campSchema = mongoose.Schema({
    
    campAddress:{
        type:String,
        required:true
    },
    campName:{
        type:String,
        required:true
    },
    campSchedule:{
        type:Date,
        default:Date.now()
    },
    capacity:{
        type:Number,
        required:true
    },
    community:{
        type:String,
        required:true,
    },
    organizerContactNumber:{
        type:String,
        required:true,
        unique:true
    },
    organizerName:{
        type:String,
        required:true
    },
    referenceId:{
        type:String,
        required:true
    },
    sponserOrganization:{
        type:String,
        required:true
    },
    //poster:{
      //  type:String
    //},
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
    }
    
    
});
campSchema.index({ location: "2dsphere" });

module.exports  =  mongoose.model('OrganizeCamp',campSchema);