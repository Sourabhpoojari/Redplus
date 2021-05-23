const bloodBank = require('../../models/bloodBank/bloodBank/bloodBank');
const Donation = require('../../models/user/donationSchema'),
	TestReport = require('../../models/user/bloodTestReportSchema'),
	PrimaryTest = require('../../models/user/primarytestSchema'),
	BloodBankProfile = require('../../models/bloodbank/bloodBank/profile'),
	moment = require('moment');

//  @route /api/user/testreport
// @desc get  of details of testreport
// @access Private to donor

const getDonations = async (req, res, next) => {
	try {
		const donation = await Donation.find({ user: req.user.id }).sort(
			'-donatedOn'
		);
		if (!donation || donation.length == 0) {
			return res.status(404).json({ msg: 'Donation not found' });
		}
		// donation.forEach((item) => {
		// 	item.date = moment(item.donatedOn).format('DD-MM-YYYY');
		// 	console.log(item.date);
		// });
		let i;
		for (i = 0; i < donation.length; i++) {
			const donationDate = moment(donation[i].donatedOn).format('DD-MM-YYYY');
			// donation[i].donationDate = moment(donation[i].donatedOn).format(
			// 	'DD-MM-YYYY'
			// );
			console.log(donationDate);
			donation[i].expiryTicket = donationDate;
			console.log(donation[i]);
		}
		console.log(donation[0].donatedOn);
		console.log(donation);
		return res.status(200).json(donation);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

const getDonationsById = async (req, res, next) => {
	try {
		let donation, bloodBankinfo, primaryTestinfo, TestReportinfo, date;
		donation = await Donation.findById(req.params.donation_id);
		if (!donation) {
			return res.status(400).json({ msg: 'Donation not found' });
		}
		bloodBankinfo = await BloodBankProfile.findOne({
			bloodbank: donation.bloodbank,
		});
		primaryTestinfo = await PrimaryTest.findOne({
			PrimaryTest: donation.PrimaryTest,
		});
		TestReportinfo = await TestReport.findOne({
			BloodTestReport: donation.BloodTestReport,
		});
		//let data =date.setDate(date.getDate());
		date = moment(primaryTestinfo.createdOn).format('DD-MM-YYYY');

		return res.status(200).json({
			Donation: donation,
			BloodBankInfo: bloodBankinfo,
			PrimaryTestInfo: primaryTestinfo,
			TestReportInfo: TestReportinfo,
			Donationdate: date,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

exports.getDonations = getDonations;
exports.getDonationsById = getDonationsById;
