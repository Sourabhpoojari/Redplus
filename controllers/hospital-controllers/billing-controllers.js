const { request } = require('express');
const Billing=require('../../models/bloodBank/request/billingRequestSchema');

//  @route /api/hospital/billing
// @desc  get billing request
// @access Private
const getHospitalBillingRequests = async (req, res, next) => {
	try {
		const requests = await Billing.find({
			hospital: req.hospital.id,
		})
			.populate('bloodBank');
        if(request.isHospital){
            return res.status(404).json({ errors: [{ msg: 'No Hospital requests found!' }] });
        }
		if (!requests) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
		}
		return res.status(200).json(requests);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getHospitalBillingRequests=getHospitalBillingRequests;