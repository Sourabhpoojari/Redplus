const mongoose = require('mongoose');

const wholeSchema = mongoose.Schema({
	bankID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'bloodBank',
	},
	donor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	group: {
		type: String,
		required: true,
	},
	segment: {
		type: String,
	},
	expiryDate: {
		type: String,
	},
	donationDate: {
		type: String,
	},
	ticket: {
		type: String,
	},
	bagNumber: {
		type: String,
	},
	createdOn: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('WHOLE', wholeSchema);
