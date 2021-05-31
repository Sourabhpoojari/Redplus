const mongoose = require('mongoose');

const pricingSchema = mongoose.Schema({
	bloodBank: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BloodBank',
	},
	WBC: {
		type: Number,
		default: 1200,
	},
	WholeBlood: {
		type: Number,
		default: 1450,
	},
	Platelet: {
		type: Number,
		default: 400,
	},
	Plasma: {
		type: Number,
		default: 400,
	},
	PRBC: {
		type: Number,
		default: 1200,
	},
	FFP: {
		type: Number,
		default: 450,
	},
	Cryoprecipitate: {
		type: Number,
		default: 200,
	},
	SPRBC: {
		type: Number,
		default: 400,
	},
	SDPlatele: {
		type: Number,
		default: 400,
	},
	SDPlasma: {
		type: Number,
		default: 400,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('PricingComponent', pricingSchema);
