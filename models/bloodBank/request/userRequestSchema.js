const mongoose = require('mongoose');

const userRequestSchema = mongoose.Schema({
	donor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	bloodBank: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BloodBank',
	},
	camp: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Camp',
	},
	createdOn: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('DonorRequest', userRequestSchema);
