const primarytestSchema = require('../../models/user/primarytestSchema'),
	BloodTestReport = require('../../models/user/bloodTestReportSchema'),
	Profile = require('../../models/user/profileSchema'),
	Donation = require('../../models/user/donationSchema'),
	{ validationResult } = require('express-validator'),
	jwt = require('jsonwebtoken'),
	config = require('config'),
	WHOLE = require('../../models/bloodBank/storage/whole-schema'),
	CRYOPRI = require('../../models/bloodBank/storage/cryo-schema'),
	FFP = require('../../models/bloodBank/storage/ffp-schema'),
	PLASMA = require('../../models/bloodBank/storage/plasma-schema'),
	PLATELET = require('../../models/bloodBank/storage/platelet-schema'),
	RBC = require('../../models/bloodBank/storage/rbc-schema'),
	SAGM = require('../../models/bloodBank/storage/sagm-schema'),
	SDPLASMA = require('../../models/bloodBank/storage/sdplasma-schema'),
	SDPLATE = require('../../models/bloodBank/storage/sdplate-schema'),
	WBC = require('../../models/bloodBank/storage/wbc-schema'),
	moment = require('moment'),
	User = require('../../models/user/userSchema'),
	DonorRequest = require('../../models/bloodBank/request/userRequestSchema'),
	PrimaryTestedDonor = require('../../models/bloodBank/request/primarytestedDonorsSchema');

//  @route /api/bloodbank/test/primarytest/:req_id
// @desc post primarytest info
// @access Private

const primaryTest = async (req, res, next) => {
	let { weight, pulse, hb, bp, temp } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	request = await DonorRequest.findById(req.params.req_id);

	if (!request) {
		return res.status(404).send('No request Found');
	}

	const { gender } = await Profile.findOne({ user: request.donor }).select(
		'gender'
	);
	//request = await DonorRequest.findOne({ donor: req.params.user_id });

	if (!gender) {
		return res.status(422).send('Donor not found!');
	}

	if (gender == 'male')
		if (weight < 50) {
			await request.delete();
			return res.status(422).send('Weight must be greater than 50');
		}
	if (hb < 13 || hb > 20) {
		await request.delete();
		return res.status(422).send('hb must be in the range 13-20');
	}
	if (gender == 'female') {
		if (weight < 45) {
			await request.delete();
			return res.status(422).send('Weight must be greater than 45');
		}
	}
	if (hb < 12.5 || hb > 20) {
		await request.delete();
		return res.status(422).send('hb must be in the range 12.5-20');
	}
	if (pulse < 60 || pulse > 100) {
		await request.delete();
		return res.status(422).send('Pulse must be in the range 60-100');
	}
	if (bp < 100 || bp > 180) {
		await request.delete();
		return res.status(422).send('bp must be in the range 100-180');
	}
	if (temp > 99.5) {
		await request.delete();
		return res.status(422).send('tempreture must be less than 99.5');
	}
	try {
		let data = {
			user: request.donor,
			bloodbank: req.bloodBank.id,
			weight,
			pulse,
			hb,
			bp,
			temp,
		};
		//console.log(data);
		primary = new primarytestSchema(data);
		await primary.save();
		const donation = new Donation({
			bloodBank: req.bloodBank.id,
			user: request.donor,
			primaryTest: primary.id,
			donationDate: moment().format('DD-MM-YYYY'),
		});
		//console.log(donation);
		await donation.save();
		return res.status(200).json({ request });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
};

//  @route/api/bloodbank/test/bagNumber/:req_id
// @desc post bagnumber
// @access Private - blood bank access only
const postBagNumber = async (req, res, next) => {
	const { bagNumber } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const request = await DonorRequest.findById(req.params.req_id);
		if (!request) {
			return res.status(404).send('No request Found');
		}
		let report = await BloodTestReport.findOne({ bagNumber: bagNumber });
		if (report) {
			return res
				.status(302)
				.json({ errors: [{ msg: 'Bag number already exists!' }] });
		}
		report = await new BloodTestReport({
			user: request.donor,
			bloodBank: req.bloodBank.id,
			bagNumber,
		});
		const primarydonor = await new PrimaryTestedDonor({
			user: request.donor,
			bloodbank: req.bloodBank.id,
			bagNumber,
		});
		//console.log(primarydonor);
		await report.save();
		await request.delete();
		await primarydonor.save();
		let user = await User.findById(request.donor);
		user.donorTicket = jwt.sign(
			{
				donor: {
					id: request.donor,
				},
			},
			config.get('DONOR_TICKET'),
			{
				expiresIn: '180D',
			}
		);
		await user.save();
		return res.status(200).json({ primarydonor });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
};

//  @route/api/bloodbank/test/bagNumbers
// @desc get bagnumber
// @access Private - blood bank access only
const getDonors = async (req, res, next) => {
	try {
		const report = await PrimaryTestedDonor.find({
			bloodbank: req.bloodBank.id,
		}).populate('user', ['name', 'phone', 'profileImage']);
		if (!report) {
			return res.status(400).json({ msg: 'report not found' });
		}
		return res.status(200).json(report);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

//  @route /api/bloodbank/:id
// @desc  get user info
// @access bloodbank
const getDonorById = async (req, res, next) => {
	try {
		let primary, donor;
		primary = await PrimaryTestedDonor.findById(req.params.req_id);
		console.log(primary);
		donor = await Profile.findOne({ user: primary.user }).populate('user', [
			'name',
			'phone',
			'profileImage',
		]);

		if (!donor) {
			return res.status(400).json({ errors: [{ msg: 'Profile not found!' }] });
		}
		return res.status(200).json(donor);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

// ###################
// Component functions
// ###################
const whole = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await WHOLE.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new WHOLE({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			bagNumber,
			segment: segNumber,
		});

		// moment
		component.duration = moment.duration(35, 'days');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				wholeBlood: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '35d',
			}
		);

		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};

const platelet = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await PLATELET.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new PLATELET({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			bagNumber,
			segment: segNumber,
		});

		// moment
		component.duration = moment.duration(5, 'days');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				platelet: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '5d',
			}
		);

		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};

const wbc = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await WBC.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new WBC({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			bagNumber,
			segment: segNumber,
		});

		// moment
		component.duration = moment.duration(42, 'days');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				wbc: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '42d',
			}
		);

		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};

const plasma = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await PLASMA.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new PLASMA({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			bagNumber,
			segment: segNumber,
		});

		// moment
		component.duration = moment.duration(1, 'year');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				plasma: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '1y',
			}
		);

		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};

const prbc = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await RBC.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new RBC({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			bagNumber,
			segment: segNumber,
		});

		// moment
		component.duration = moment.duration(42, 'days');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				rbc: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '42d',
			}
		);

		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};

const ffp = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await FFP.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new FFP({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			bagNumber,
			segment: segNumber,
		});

		// moment
		component.duration = moment.duration(1, 'year');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				ffp: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '1y',
			}
		);

		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};

const cryo = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await CRYOPRI.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new CRYOPRI({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			bagNumber,
			segment: segNumber,
		});

		// moment
		component.duration = moment.duration(1, 'year');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				cryo: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '1y',
			}
		);

		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};

const sprbc = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await SAGM.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new SAGM({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			segment: segNumber,
			bagNumber,
		});

		// moment
		component.duration = moment.duration(1, 'year');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				sagm: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '1y',
			}
		);

		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};

const sdplate = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await SDPLATE.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new SDPLATE({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			segment: segNumber,
			bagNumber,
		});

		// moment
		component.duration = moment.duration(5, 'days');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				sdplate: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '5d',
			}
		);

		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};

const sdplasma = async (req, report, bgroup, segNumber, bagNumber) => {
	let component;
	try {
		if (
			await SDPLASMA.findOne({
				bankID: req.bloodBank.id,
				bagNumber,
				segment: segNumber,
			})
		) {
			return -1;
		}
		component = await new SDPLASMA({
			bankID: req.bloodBank.id,
			donor: report.user,
			group: bgroup,
			bagNumber,
			segment: segNumber,
		});

		// moment
		component.duration = moment.duration(1, 'year');
		// assign expiry ticket
		component.ticket = jwt.sign(
			{
				sdplasma: {
					id: component.id,
				},
			},
			config.get('STOCKSECRET'),
			{
				expiresIn: '1y',
			}
		);
		await component.save();
	} catch (err) {
		console.error(err);
		return -2;
	}
};
// ###################
// Get test Credits
// ###################
const testCredit = async (
	rbcCount,
	wbcCount,
	plateCount,
	hemoglobinCount,
	hematocrit,
	bglucose,
	diastolic,
	systrolic,
	gender,
	credits
) => {
	try {
		if (gender == 'male') {
			if (4.7 < rbcCount < 6.1) {
				credits += 25;
			}
			if (4.5 < wbcCount < 11) {
				credits += 25;
			}
			if (13.5 < hemoglobinCount < 17.5) {
				credits += 25;
			}
			if (41 < hematocrit < 50) {
				credits += 25;
			}
		}
		if (gender == 'female') {
			if (4.2 < rbcCount < 5.4) {
				credits += 25;
			}
			if (4.5 < wbcCount < 11) {
				credits += 25;
			}
			if (12 < hemoglobinCount < 15.5) {
				credits += 25;
			}
			if (36 < hematocrit < 48) {
				credits += 25;
			}
		}
		if (150000 < plateCount < 450000) {
			credits += 25;
		}
		if (bglucose == 140) {
			credits += 25;
		}
		if (diastolic == 80 && systrolic == 120) {
			credits += 25;
		}
		return credits;
	} catch (err) {
		console.error(err.message);
	}
};

//  @route /api/bloodbank/test/bloodTestReport/:request_id
// @desc post bloodtest Report
// @access Private
const testReportAndCredits = async (req, res, next) => {
	let {
		bgroup,
		segNumber,
		components,
		rbcCount,
		wbcCount,
		plateCount,
		hemoglobinCount,
		hematocrit,
		bglucose,
		systrolic,
		diastolic,
		diseases,
	} = req.body;
	rbcCount = parseFloat(rbcCount);
	wbcCount = parseFloat(wbcCount);
	plateCount = parseFloat(plateCount);
	hemoglobinCount = parseFloat(hemoglobinCount);
	hematocrit = parseFloat(hematocrit);
	bglucose = parseFloat(bglucose);
	// bp = parseFloat(bp);
	// const bagNumber = req.params.bagNumber;

	// #############
	// DEFINE COMPONENT STATUS FLAG
	// #############
	let WHOLEBLOOD_STATUS = 0,
		PLATELET_STATUS = 0,
		WBC_STATUS = 0,
		PLASMA_STATUS = 0,
		PRBC_STATUS = 0,
		FFP_STATUS = 0,
		CRYO_STATUS = 0,
		SPRBC_STATUS = 0,
		SDPLATELET_STATUS = 0,
		SDPLASMA_STATUS = 0;

	// Error validations
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	let report,
		credits = 0;

	try {
		const request = await PrimaryTestedDonor.findById(req.params.request_id);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'Request not found!' }] });
		}
		report = await BloodTestReport.findOne({
			user: request.user,
			bloodBank: req.bloodBank.id,
		});
		if (!report) {
			return res
				.status(302)
				.json({ errors: [{ msg: 'Bag number do not exist!' }] });
		}
		const bagNumber = report.bagNumber;
		if (!components) {
			return res
				.status(302)
				.json({ errors: [{ msg: 'Component is required!' }] });
		}

		// ################
		// credit points  - component credits
		//  ###############
		components.map(async (component) => {
			if (component == 'WholeBlood') {
				credits += 20;
				WHOLEBLOOD_STATUS = 1;
			}
			if (component === 'Platelet') {
				credits += 20;
				PLATELET_STATUS = 1;
			}
			if (component === 'WBC') {
				credits += 20;
				WBC_STATUS = 1;
			}
			if (component === 'Plasma') {
				credits += 20;
				PLASMA_STATUS = 1;
			}
			if (component === 'PRBC') {
				credits += 20;
				PRBC_STATUS = 1;
			}
			if (component === 'FFP') {
				credits += 20;
				FFP_STATUS = 1;
			}
			if (component === 'Cryoprecipitate') {
				credits += 20;
				CRYO_STATUS = 1;
			}
			if (component === 'SPRBC') {
				credits += 20;
				SPRBC_STATUS = 1;
			}
			if (component === 'SDPlatelet') {
				credits += 20;
				SDPLATELET_STATUS = 1;
			}
			if (component === 'SDPlasma') {
				credits += 20;
				SDPLASMA_STATUS = 1;
			}
		});
		// credit points -  add blood group credits
		if (bgroup == 'A+Ve') {
			credits += 55;
		}
		if (bgroup == 'A-Ve') {
			credits += 90;
		}
		if (bgroup == 'B+Ve') {
			credits += 45;
		}
		if (bgroup == 'B-Ve') {
			credits += 85;
		}
		if (bgroup == 'AB+Ve') {
			credits += 70;
		}
		if (bgroup == 'AB-Ve') {
			credits += 100;
		}
		if (bgroup == 'O+Ve') {
			credits += 40;
		}
		if (bgroup == 'O-Ve') {
			credits += 85;
		}
		// ###################
		// COMPONENT FUNCTIONS
		// ###################
		let flag = 0;
		if (WBC_STATUS == 1) {
			WBC_STATUS = 0;
			flag = await wbc(req, report, bgroup, segNumber, bagNumber);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		if (WHOLEBLOOD_STATUS == 1) {
			WHOLEBLOOD_STATUS = 0;
			flag = await whole(req, report, bgroup, segNumber, bagNumber);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		if (PLASMA_STATUS == 1) {
			PLASMA_STATUS = 0;
			flag = await plasma(
				req,
				report,
				bgroup,
				segNumber,

				bagNumber
			);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		if (PLATELET_STATUS == 1) {
			PLATELET_STATUS = 0;
			flag = await platelet(
				req,
				report,
				bgroup,
				segNumber,

				bagNumber
			);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		if (PRBC_STATUS == 1) {
			PRBC_STATUS = 0;
			flag = await prbc(req, report, bgroup, segNumber, bagNumber);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		if (FFP_STATUS == 1) {
			FFP_STATUS = 0;
			flag = await ffp(req, report, bgroup, segNumber, bagNumber);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		if (CRYO_STATUS == 1) {
			CRYO_STATUS = 0;
			flag = await cryo(req, report, bgroup, segNumber, bagNumber);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		if (SPRBC_STATUS == 1) {
			SPRBC_STATUS = 0;
			flag = await sprbc(req, report, bgroup, segNumber, bagNumber);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		if (SDPLATELET_STATUS == 1) {
			SDPLATELET_STATUS = 0;
			flag = await sdplate(
				req,
				report,
				bgroup,
				segNumber,

				bagNumber
			);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		if (SDPLASMA_STATUS == 1) {
			SDPLASMA_STATUS = 0;
			flag = await sdplasma(
				req,
				report,
				bgroup,
				segNumber,

				bagNumber
			);
			if (flag == -1) {
				return res.status(302).json({
					errors: [
						{
							msg: 'Component with this Segment Number or Bag Number already exist!',
						},
					],
				});
			} else if (flag == -2) {
				return res.status(500).send('Server error');
			}
		}
		//  ##################
		// credit points- test results
		// ###################
		const { gender } = await Profile.findOne({ user: report.user }).select(
			'gender'
		);
		credits = await testCredit(
			rbcCount,
			wbcCount,
			plateCount,
			hemoglobinCount,
			hematocrit,
			bglucose,
			diastolic,
			systrolic,
			gender,
			credits
		);
		// RBC count result
		if (!diseases) {
			credits += 25;
		}
		// get latest donationSchema
		const donationArray = await Donation.find({
				user: report.user,
				bloodBank: req.bloodBank.id,
			}).sort('-donatedOn'),
			donation = donationArray[0];
		if (credits) donation.credits = credits;
		// add expiry for credits
		donation.expiryTicket = jwt.sign(
			{
				credit: {
					id: donation.id,
				},
			},
			config.get('CREDITSECRET'),
			{
				expiresIn: '180d',
			}
		);
		// add duration
		donation.creditDuration = moment.duration(180, 'days');

		// ###########
		// save Test report
		// ###########
		report.bgroup = bgroup;
		report.rbcCount = rbcCount;
		report.wbcCount = wbcCount;
		report.plateCount = plateCount;
		report.hemoglobinCount = hemoglobinCount;
		report.hematocrit = hematocrit;
		report.bglucose = bglucose;
		report.bp.systrolic = systrolic;
		report.bp.diastolic = diastolic;
		report.diseases = diseases;
		await report.save();
		donation.report = report.id;
		await donation.save();
		//let testreport;

		await request.delete();

		return res.status(200).json(report);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.testReportAndCredits = testReportAndCredits;
exports.primaryTest = primaryTest;
exports.postBagNumber = postBagNumber;
exports.getDonorBagNumber = getDonors;
exports.getDonorById = getDonorById;
