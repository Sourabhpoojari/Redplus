const mongoose = require('mongoose');

const flashRequestSchema = mongoose.Schema({
	bloodBank: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BloodBank',
	},
	numbers: [{ type: Number }],
	bgroup: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('FlashRequest', flashRequestSchema);
