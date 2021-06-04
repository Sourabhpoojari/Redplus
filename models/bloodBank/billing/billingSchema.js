const mongoose = require('mongoose');

const billingSchema = mongoose.Schema({
	donor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});
