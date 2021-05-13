const mongoose = require('mongoose');

const sdplasmaSchema = mongoose.Schema({
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
		unique: true,
	},
	duration: {
		type: String,
	},
	ticket: {
		type: String,
	},
	bagNumber: {
		type: String,
		unique: true,
	},
	createdOn: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('SDPLASMA', sdplasmaSchema);
