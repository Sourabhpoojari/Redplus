const Donation = require('../../models/user/donationSchema'),
	BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
	Profile = require('../../models/user/profileSchema');

//  @route /api/user/donations
// @desc get donations of user
// @access Private to donor

const getDonations = async (req, res, next) => {
	try {
		let donation = await Donation.find({ user: req.user.id }).sort(
			'-donatedOn'
		);
		if (!donation || donation.length == 0) {
			return res.status(404).json({ msg: 'Donation not found' });
		}
		let i;
		const arr = [];

		for (i = 0; i < donation.length; i++) {
			const profile = await BloodBankProfile.findOne({
				bloodBank: donation[i].bloodBank,
			});
			const bank = { donation: donation[i], profile };
			arr.push(bank);
		}

		return res.status(200).json(arr);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

//  @route /api/user/donations/:donation_id
// @desc get details of donation
// @access Private to donor
const getDonationById = async (req, res, next) => {
	try {
		const donation = await Donation.findById(req.params.donation_id)
			.populate('primaryTest')
			.populate('report');
		
		if (!donation) {
			return res.status(400).json({ msg: 'Donation not found' });
		}
		const bloodBankinfo = await BloodBankProfile.findOne({
			bloodBank: donation.bloodBank,
		});
		const profile = await Profile.findOne({ user: donation.user }).populate(
			'user',
			['phone']
		);

		return res.status(200).json({
			donation,
			bloodBankinfo,
			userInfo: profile,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

exports.getDonations = getDonations;
exports.getDonationsById = getDonationById;
