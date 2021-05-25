const mongoose = require('mongoose');

<<<<<<< HEAD
const bloodRequestfromDonor = mongoose.Schema({
	donor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	bloodBank: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BloodBank',
	},
	createdOn: {
		type: Date,
		default: Date.now(),
	},
	patientName: {
		type: String,
	},
	hospitalName: {
		type: String,
	},
	age: {
		type: Number,
	},
	bloodGroup: {
		type: String,
	},
	wbc: {
		type: Number,
	},
	wholeBlood: {
		type: Number,
	},
	platelet: {
		type: Number,
	},
	plasma: {
		type: Number,
	},
	sdPlatelet: {
		type: Number,
	},
	prbc: {
		type: Number,
	},
	ffp: {
		type: Number,
	},
	cryo: {
		type: Number,
	},
	sprbc: {
		type: Number,
	},
	sdPlasma: {
		type: Number,
	},
=======
const bloodRequestfromDonor= mongoose.Schema({
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
    pattientName:{
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
    wbc:{
        type:Number
    },
    wholeBlood:{
        type:Number
    },
    platelet:{
        type:Number
    },
    plasma:{
        type:Number
    },
    sdPlatelet:{
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
    sdPlasma:{
        type:Number
    }
>>>>>>> 04823fefedca4c281289349a04d403428cda2e8b
});

module.exports = mongoose.model(
	'BloodRequesttoBloodBank',
	bloodRequestfromDonor
);
