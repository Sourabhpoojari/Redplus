const Billing = require('../../models/bloodBank/billing/billingSchema');

//  @route /api/bloodBank/bill
// @desc  get blood bill
// @access Private
const getBills = async (req, res, next) => {
	try {
		const bills = await Billing.find({ hospital: req.hospital.id,isHospital:true }).populate(
			'bloodBankProfile');
		if (!bills) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
		}
		return res.status(200).json(bills);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/bloodBank/bill/:id
// @desc  get blood bill by id
// @access Private
const getBillById = async (req, res, next) => {
	try {
		const bill = await Billing.findById(req.params.id)
			.populate('bloodBankProfile');
		if (!bill) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
        if(!bill.isHospital){
            return res.status(404).json({ errors: [{ msg: 'No Hospital request found!' }] });
        }
		return res.status(200).json(bill);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getBills = getBills;
exports.getBillById = getBillById;
