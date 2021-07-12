const mongoose = require('mongoose');

const campshedule = mongoose.Schema({
	orgainizer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	bloodBankOrganizer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BloodBank',
	},
	hospitalOrganizer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Hospital',
	},
	isCampToday:{
		type:Boolean,
		default:false,
	},
	address: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	date: {
		type: String,
	},
	timefrom: {
		type: String,
	},
	timeto: {
		type: String,
	},
	donations: {
		type: Number,
	},
	organization: {
		type: String,
	},
	requestForm: {
		type: String,
	},
	poster: {
		type: String,
	},
	bloodBanks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'BloodBank',
		},
	],
	location: {
		type: {
			type: 'String',
			default: 'Point', // Don't do `{ location: { type: String } }`
			// 'location.type' must be 'Point'
			// required: true
		},
		// type:Point,
		coordinates: {
			type: [Number],
			required: true,
		},
	},
});
campshedule.index({ location: '2dsphere' });

module.exports = mongoose.model('Camp', campshedule);
