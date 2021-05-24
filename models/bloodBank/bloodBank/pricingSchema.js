const mongoose = require('mongoose');

const pricingSchema = mongoose.Schema({
    wbc:{
        type:Number
    },
    whole:{
        type:Number
    },
    platelet:{
        type:Number
    },
    plasma:{
        type:Number
    },
    prbc:{
        type:Number
    },
    ffp:{
        type:Number
    },
    cryo:{
        type:Number
    },
    sprbc:{
        type:Number
    },
    sdplatelet:{
        type:Number
    },
    sdplasma:{
        type:Number
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('PricingComponent',pricingSchema);