const mongoose = require('mongoose');

const campSchema = mongoose.Schema({
    donor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bloodBank:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BloodBank'
    },
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
    },
    capacity:{
        type:Number,
    },
    community:{
        type:String,
    },
    referenceId:{
        type:String,
    },
    sponserOrganization:{
        type:String,
    },
    poster:{
      type:String
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
    }
    
    
});
campSchema.index({ location: "2dsphere" });

module.exports  = mongoose.models.OrganizeCamp || mongoose.model('OrganizeCamp',campSchema);