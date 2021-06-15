const Expiry = require('../../models/bloodBank/inventory/expirySchema');

//  @route /api/bloodbank/expiry
// @desc GET expired components
// @access Private - bloodbank access only
const getExpired = async (req, res, next) => {
	try {
		const expiry = await Expiry.find({ bankID: req.bloodBank.id });
		if (!expiry || expiry.length == 0) {
			return res
				.status(404)
				.json({ errors: [{ msg: 'No Components Found!' }] });
		}
		return res.status(201).json(expiry);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route DEL  /api/bloodbank/expiry/:id
// @desc delete expired components
// @access Private - bloodbank access only
const deleteExpiry = async (req, res, next) => {
	try {
		const expired = await Expiry.findById(req.params.id);
		if (!expired) {
			return res
				.status(404)
				.json({ errors: [{ msg: 'Component Not Found!' }] });
		}
		await expired.delete();
		return res.status(204).json({ msg: 'Component Deleted!' });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getExpired = getExpired;
exports.deleteExpiry = deleteExpiry;
