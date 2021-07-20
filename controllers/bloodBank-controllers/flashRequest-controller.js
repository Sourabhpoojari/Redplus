const { response } = require('express');
const Donor = require('../../models/user/donorlocationSchema'),
	BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
	Profile = require('../../models/user/profileSchema'),
	{ validationResult } = require('express-validator'),
	fast2sms = require('fast-two-sms'),
	config = require('config');

//  @route /api/bloodbank/flashrequest
// @desc request for donor for blood
// @access Private
const flashRequest = async (req, res, next) => {
	try {
		const { bgroup } = req.body;
		const bloodBankProfile = await BloodBankProfile.findOne({
			bloodBank: req.bloodBank.id,
		});
		const { location } = bloodBankProfile;
		const lat = location.coordinates[0],
			lang = location.coordinates[1];
		let donors = await Donor.aggregate([
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
		let donor = [];
		for (let i = 0; i < donors.length; i++) {
			const profile = await Profile.findOne({
				user: donors[i].user,
				bloodGroup: bgroup,
			}).populate('user', ['phone']);
			if (profile) {
				let { phone } = profile.user;
				phone = phone.slice(3, 13);
				donor.push(parseInt(phone));
			}
		}
		const text =
			'Urgent Requirement of ' +
			bgroup +
			' blood in ' +
			bloodBankProfile.bloodBankName;
		const options = {
			authorization: config.get('FAST2SMS'),
			message: text,
			numbers: donor,
		};
		fast2sms
			.sendMessage(options)
			.then((response) => {
				return res.status(200).json(response.message);
			})
			.catch((err) => {
				console.error(err);
				return res.status(500).send('SMS Error');
			});
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.flashRequest = flashRequest;
