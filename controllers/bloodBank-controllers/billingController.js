const BillingRequest = require('../../models/bloodBank/request/billingRequestSchema');

//  @route /api/bloodBank/billing
// @desc  get billing request
// @access Private
const getBillingRequests = async (req, res, next) => {
	try {
		const requests = await BillingRequest.find({
			bloodBank: req.bloodBank.id,
		})
			.populate('bookings')
			.populate('donor', ['profileImage', 'phone', 'name']);
		if (!requests) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
		}
		return res.status(200).json(requests);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/bloodBank/billing/:id
// @desc  post blood bank signup request
// @access Public

exports.getBillingRequests = getBillingRequests;
