const mongoose = require('mongoose');

const pricingSchema = mongoose.Schema({
    bloodBank: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BloodBank',
	},
    wbc:{
        type:Number,
        default:1200
    },
    whole:{
        type:Number,
        default:1450
    },
    platelet:{
        type:Number,
        default:400
    },
    plasma:{
        type:Number,
        default:400
    },
    prbc:{
        type:Number,
        default:1200
    },
    ffp:{
        type:Number,
        default:450
    },
    cryo:{
        type:Number,
        default:200
    },
    sprbc:{
        type:Number
    },
    sdplatelet:{
        type:Number,
        default:400
    },
    sdplasma:{
        type:Number,
        default:400
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('PricingComponent',pricingSchema);