const mongoose = require('mongoose');

const billingSchema = mongoose.Schema({
	request: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BillingRequest',
	},
	donor: {
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
	isHospital: {
		type: Boolean,
		default: false,
	},
	issueDate: {
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
	components: [
		{
			component: { type: String },
			price: { type: Number },
			quantity: { type: Number },
			totalCost: { type: Number },
		},
	],
	subTotal: {
		type: Number,
	},
	credits: {
		type: Number,
	},
	grandTotal: {
		type: Number,
	},
	segment: { type: String },
	expiryDate: {
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

module.exports = mongoose.model('Billing', billingSchema);
