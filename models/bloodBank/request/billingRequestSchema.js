const mongoose = require('mongoose');

const billingRequestSchema = mongoose.Schema({
	donor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	bloodBank: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BloodBank',
	},
	hospital:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Hospital',
	},
	isHospital:{
		type:Boolean,
		default:false,
	},
	status:{
		type:Boolean,
		default:false,
	},
	RequestDate: {
		type: String,
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
	WBC: {
		type: Number,
	},
	WholeBlood: {
		type: Number,
	},
	Platelet: {
		type: Number,
	},
	Plasma: {
		type: Number,
	},
	PRBC: {
		type: Number,
	},
	FFP: {
		type: Number,
	},
	Cryoprecipitate: {
		type: Number,
	},
	SPRBC: {
		type: Number,
	},
	SDPlatele: {
		type: Number,
	},
	SDPlasma: {
		type: Number,
	},
	bookings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Booking',
		},
	],
});

module.exports = mongoose.model('BillingRequest', billingRequestSchema);
