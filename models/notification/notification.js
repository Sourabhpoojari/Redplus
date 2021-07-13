const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	bloodBank: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BloodBank',
	},
	hospital: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Hospital',
	},
	body: {
		type: String,
	},
	status: {
		type: Boolean,
		default: false,
	},
	createOn: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('Notification', notificationSchema);
