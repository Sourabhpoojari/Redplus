const BloodBank = require('../../models/bloodbank/bloodBank/profile'),
	{ validationResult } = require('express-validator'),
	UserLocation = require('../../models/user/donorlocationSchema');

//  @route /api/user/findblood
// @desc get bloodBank list based on currrent location
// @access Private

const getnearbybloodBank = async (req, res, next) => {
	let { lat, lang } = req.body;
	lat = parseFloat(lat);
	lang = parseFloat(lang);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		let bloodBank = await BloodBank.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [lat, lang],
					},
					distanceField: 'distance',
					maxDistance: 50000,
					spherical: true,
				},
			},
		]);
		bloodBank.forEach((item) => {
			item.distance = parseFloat(item.distance / 1000).toFixed(2);
		});

		return res.status(200).json(bloodBank);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/user/findblood/:component/:bgroup
// @desc get bloodBank list based on currrent location with blood available status
// @access Private
const getBloodBlanks = async (req, res, next) => {
	const { component, bgroup } = req.params;
	try {
		const { location } = await UserLocation.findOne({
			user: req.user.id,
		}).select('location');
		const lat = location.coordinates[0],
			lang = location.coordinates[1];
		let bloodBank = await BloodBank.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [lat, lang],
					},
					distanceField: 'distance',
					maxDistance: 50000,
					spherical: true,
				},
			},
		]);
		bloodBank.forEach((item) => {
			item.distance = parseFloat(item.distance / 1000).toFixed(2);
		});
		console.log(bloodBank);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getnearbybloodBank = getnearbybloodBank;
exports.getBloodBlanks = getBloodBlanks;
