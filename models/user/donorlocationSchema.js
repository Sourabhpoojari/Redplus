const mongoose = require('mongoose');

const donorLocation = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        unique:true
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
          default:[19.858280572578117,80.84793327026397],
          required: true
        }
      },
      locationCreatedAt:{
        type:Date,
        default:Date.now()
    }

});

donorLocation.index({ location: "2dsphere" });

module.exports = mongoose.model('UserLocation',donorLocation);