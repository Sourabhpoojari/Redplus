const BloodBank = require('../../models/bloodBank/bloodBank/profile'),
	BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
	Camp = require('../../models/camp/camp'),
	moment = require('moment'),
	UserLocation = require('../../models/user/donorlocationSchema');

//  @route /api/user/donateblood
// @desc get  & camp list based on currrent location
// @access Private
const donateBloodInfo = async (req, res, next) => {
	const { location } = await UserLocation.findOne({ user: req.user.id }).select(
		'location'
	);
	const lat = location.coordinates[0];
	lang = location.coordinates[1];

	try {
		let bloodBank = await BloodBank.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [lat, lang],
					},
					distanceField: 'distance',
					maxDistance: 40000,
					spherical: true,
				},
			},
		]);
		bloodBank.forEach((item) => {
			item.distance = parseFloat(item.distance / 1000).toFixed(2);
		});
		let camps = await Camp.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [lat, lang],
					},
					distanceField: 'distance',
					maxDistance: 75000,
					spherical: true,
				},
			},
			{
				$match: {
					date: moment().format('DD-MM-YYYY'),
				},
			},
		]);

		camps.forEach((item) => {
			item.distance = parseFloat(item.distance / 1000).toFixed(2);
		});

		return res.status(200).json({ bloodBanks: bloodBank, camps: camps });
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/user/donateblood/:camp_id
// @desc get bloodBank list based of camps
// @access Private
const getBloodBanks = async (req, res, next) => {
	try {
		const { bloodBanks } = await Camp.findById(req.params.camp_id);
		const bloodBankProfiles = [];
		for (let i = 0; i < bloodBanks.length; i++) {
			const profile = await BloodBankProfile.findOne({
				bloodBank: bloodBanks[i],
			});
			bloodBankProfiles.push(profile);
		}
		return res.status(200).json(bloodBankProfiles);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.donateBloodInfo = donateBloodInfo;
exports.getBloodBanks = getBloodBanks;
