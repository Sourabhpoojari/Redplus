const mongoose = require('mongoose');

const cryopriSchema = mongoose.Schema({
	bankID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'bloodBank',
	},
	donor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	segment: {
		type: String,
		unique: true,
	},
	group: {
		type: String,
		required: true,
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

module.exports = mongoose.model('CRYOPRI', cryopriSchema);
