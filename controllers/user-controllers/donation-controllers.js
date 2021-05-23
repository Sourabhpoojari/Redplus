const bloodBank = require('../../models/bloodBank/bloodBank/bloodBank');
const Donation = require('../../models/user/donationSchema'),
	TestReport = require('../../models/user/bloodTestReportSchema'),
	PrimaryTest = require('../../models/user/primarytestSchema'),
	BloodBankProfile = require('../../models/bloodbank/bloodBank/profile'),
	moment = require('moment');

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
		let bloodBankinfo, primaryTestinfo, TestReportinfo, date;
		const donation = await Donation.findById(req.params.donation_id).populate(
			'primaryTest'
		);
		console.log(donation);
		if (!donation) {
			return res.status(400).json({ msg: 'Donation not found' });
		}
		// bloodBankinfo = await BloodBankProfile.findOne({
		// 	bloodbank: donation.bloodbank,
		// });
		// primaryTestinfo = await PrimaryTest.findOne({
		// 	PrimaryTest: donation.PrimaryTest,
		// });
		// TestReportinfo = await TestReport.findOne({
		// 	BloodTestReport: donation.BloodTestReport,
		// });

		return res.status(200).json({
			Donation: donation,
			// BloodBankInfo: bloodBankinfo,
			// PrimaryTestInfo: primaryTestinfo,
			// TestReportInfo: TestReportinfo,
			// Donationdate: date,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

exports.getDonations = getDonations;
exports.getDonationsById = getDonationById;
