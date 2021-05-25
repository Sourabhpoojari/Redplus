const mongoose = require('mongoose');

const bloodRequest= mongoose.Schema({
    donor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bloodBank:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BloodBank'
    },
    RequestDate: {
		type: String,
	},
    patientName:{
        type:String
    },
    hospitalName:{
        type: String
    },
    age:{
        type:Number
    },
    bloodGroup:{
        type:String
    },
    WBC:{
        type:Number
    },
    WholeBlood:{
        type:Number
    },
    Platelet:{
        type:Number
    },
    Plasma:{
        type:Number
    },
    PRBC:{
        type:Number
    },
    FFP:{
        type:Number
    },
    Cryoprecipitate:{
        type:Number
    },
    SPRBC:{
        type:Number
    },
    SDPlatele:{
        type:Number
    },
    SDPlasma:{
        type:Number
    }
});


module.exports= mongoose.model('BloodRequestForm',bloodRequest);