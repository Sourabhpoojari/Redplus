const { request } = require('express'),
	BillingRequest = require('../../models/bloodBank/request/billingRequestSchema'),
	BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
	Pricing = require('../../models/bloodBank/bloodBank/pricingSchema'),
	Billing = require('../../models/bloodBank/billing/billingSchema'),
	moment = require('moment'),
	User = require('../../models/user/userSchema'),
	Profile = require('../../models/user/profileSchema'),
	Booking = require('../../models/bloodBank/inventory/bookingSchema'),
	wbcSchema = require('../../models/bloodBank/storage/wbc-schema'),
	wholeSchema = require('../../models/bloodBank/storage/whole-schema'),
	cryoSchema = require('../../models/bloodBank/storage/cryo-schema'),
	ffpSchema = require('../../models/bloodBank/storage/ffp-schema'),
	plasmaSchema = require('../../models/bloodBank/storage/plasma-schema'),
	plateletSchema = require('../../models/bloodBank/storage/platelet-schema'),
	prbcSchema = require('../../models/bloodBank/storage/rbc-schema'),
	sagmSchema = require('../../models/bloodBank/storage/sagm-schema'),
	sdplasmaSchema = require('../../models/bloodBank/storage/sdplasma-schema'),
	sdplateSchema = require('../../models/bloodBank/storage/sdplate-schema'),
	config = require('config'),
	accountSid = config.get('TWILIO_ACCOUNT_SID1'),
	authToken = config.get('TWILIO_AUTH_TOKEN'),
	sid = config.get('TWILIO_SID'),
	{ validationResult } = require('express-validator'),
	client = require('twilio')(accountSid, authToken);

//  @route /api/hospital/billing
// @desc  get billing request
// @access Private
const getHospitalBillingRequests = async (req, res, next) => {
	try {
		const requests = await BillingRequest.find({
			hospital: req.hospital.id,
			isHospital: true,
			status: false,
		}).populate('bookings');

		if (!requests || requests.length == 0) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
		}

		let i;
		const arr = [];

		for (i = 0; i < requests.length; i++) {
			const bloodBnakDetails = await BloodBankProfile.findOne({
				bloodBank: requests[i].bloodBank,
			});
			const billing = { requests: requests[i], bloodBnakDetails };
			arr.push(billing);
		}

		return res.status(200).json(arr);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/hospital/billing/:id
// @desc  get billing request by id
// @access Private to hospital Blood bank
const gethospitalBillingRequestById = async (req, res, next) => {
	try {
		const request = await BillingRequest.findById(req.params.id).populate(
			'bookings'
		);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
		if (request.isHospital == 'false') {
			return res.status(400).json({ msg: 'No Hospital requests found!!!' });
		}

		const { hospitalName, patientName, age, bloodGroup, bookings } = request;

		let bill = await Billing.findOne({ request: req.params.id }).populate(
			'BloodBankProfile'
		);
		if (!bill) {
			const profile = await BloodBankProfile.findOne({
				bloodBank: request.bloodBank,
			});
			const price = await Pricing.findOne({ bloodBank: request.bloodBank });
			bill = await new Billing({
				request: req.params.id,
				hospital: req.hospital.id,
				bloodBank: request.bloodBank,
				issueDate: moment().format('DD-MM-YYYY'),
				hospitalName,
				patientName,
				age,
				bloodGroup,
				isHospital: true,
				bloodBankProfile: profile.id,
			});
			let sum = 0;
			bookings.forEach((item) => {
				const data = {
					component: item.component,
					expiryDate: item.expiryDate,
					bagNumber: item.bagNumber,
				};
				if (item.component == 'WBC') {
					data.price = price.WBC;
					sum += price.WBC;
				}
				if (item.component == 'WholeBlood') {
					data.price = price.WholeBlood;
					sum += price.WholeBlood;
				}
				if (item.component == 'Platelet') {
					data.price = price.Platelet;
					sum += price.Platelet;
				}
				if (item.component == 'Plasma') {
					data.price = price.Plasma;
					sum += price.Plasma;
				}
				if (item.component == 'PRBC') {
					data.price = price.PRBC;
					sum += price.PRBC;
				}
				if (item.component == 'FFP') {
					data.price = price.FFP;
					sum += price.FFP;
				}
				if (item.component == 'Cryoprecipitate') {
					data.price = price.Cryoprecipitate;
					sum += price.Cryoprecipitate;
				}
				if (item.component == 'SPRBC') {
					data.price = price.SPRBC;
					sum += price.SPRBC;
				}
				if (item.component == 'SDPlate') {
					data.price = price.SDPlatele;
					sum += price.SDPlatele;
				}
				if (item.component == 'SDPlasma') {
					data.price = price.SDPlasma;
					sum += price.SDPlasma;
				}
				bill.components.push(data);
			});

			bill.subTotal = sum;
			bill.grandTotal = sum;
			await bill.save();
		}
		const bprofile = await BloodBankProfile.findOne({
			bloodBank: request.bloodBank,
		});
		return res.status(200).json({ request, bill, bprofile });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/hospital/billing/:id
// @desc  reject billing request
// @access Private hospital access only
const rejectRequest = async (req, res, next) => {
	try {
		const request = await BillingRequest.findById(req.params.id).populate(
			'bookings'
		);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'Request not found!' }] });
		}
		const { bookings } = request;
		bookings.forEach(async (item) => {
			if (item.component == 'WBC') {
				const stock = await new wbcSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}

			if (item.component == 'WholeBlood') {
				const stock = await new wholeSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'Platelet') {
				const stock = await new plateletSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'Plasma') {
				const stock = await new plasmaSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'PRBC') {
				const stock = await new prbcSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'FFP') {
				const stock = await new ffpSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'Cryoprecipitate') {
				const stock = await new cryoSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'SPRBC') {
				const stock = await new sagmSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'SDPlate') {
				const stock = await new sdplateSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			if (item.component == 'SDPlasma') {
				const stock = await new sdplasmaSchema({
					bankID: item.bankID,
					donor: item.donor,
					group: item.group,
					segment: item.segment,
					expiryDate: item.expiryDate,
					donationDate: item.donationDate,
					ticket: item.ticket,
					bagNumber: item.bagNumber,
					createdOn: item.createdOn,
				});
				await stock.save();
			}
			await Booking.findByIdAndDelete(item.id);
		});
		await request.delete();
		return res.status('200').json({ msg: 'Request Rejected!!' });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/hospital/billing/:id/getCredits/:phone
// @desc  get credits
// @access Private hospital access only
const getCredits = async (req, res, next) => {
	try {
		const request = await BillingRequest.findById(req.params.id);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
		if (request.isHospital == false) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Not a Hospital request!!!' }] });
		}
		const user = await User.findOne({ phone: req.params.phone });
		const credits = await Profile.findOne({ user: user.id }).select('credits');
		if (!user || !credits) {
			return res.status(404).json({ msg: 'User not found' });
		}
		return res.status(200).json(credits);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route POST /api/hospital/billing/:id/useCredits
// @desc  use credits
// @access Private hospital access only
const sendOtp = async (req, res, next) => {
	const { phone } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const request = await BillingRequest.findById(req.params.id);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
		if (request.isHospital == false) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Not a Hospital request!!!' }] });
		}
		const user = await User.findOne({ phone });
		const { credits } = await Profile.findOne({ user: user.id }).select(
			'credits'
		);
		if (credits == 0) {
			return res
				.status(400)
				.json({ msg: "You don't have enough credits to use" });
		}
		client.verify
			.services(sid)
			.verifications.create({ to: phone, channel: 'sms' })
			.then((verification) => {
				console.log(verification);

				return res.status(200).json(verification.status);
			})
			.catch((err) => {
				console.error(err);
				return res.status(408).send('OTP Problem');
			});
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route POST /api/hospital/billing/:id/useCreditsByBenificiary
// @desc  use credits by benificiary
// @access Private Hospital access only
const sendBenificiaryOtp = async (req, res, next) => {
	const { phone } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const request = await BillingRequest.findById(req.params.id);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
		if (request.isHospital == false) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Not a Hospital request !!!' }] });
		}
		const user = await User.findOne({ phone });
		const profile = await Profile.findOne({ user: user.id });
		if (profile.credits == 0) {
			return res
				.status(400)
				.json({ errors: [{ msg: "You don't have enough credits to use" }] });
		}
		if (!profile.benificiary.bphone) {
			return res
				.status(404)
				.json({ errors: [{ msg: 'No Benificary Found!!' }] });
		}
		const bPhone = profile.benificiary.bphone;
		client.verify
			.services(sid)
			.verifications.create({ to: bPhone, channel: 'sms' })
			.then((verification) => {
				return res.status(200).json(verification.status);
			})
			.catch((err) => {
				console.error(err);
				return res.status(408).send('OTP Problem');
			});
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route POST /api/hospital/billing/:id/verifyOtp
// @desc  verify otp to use credits
// @access Private hospital access only
const verifyOtp = async (req, res, next) => {
	const { phone, code } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const request = await BillingRequest.findById(req.params.id);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
		if (request.isHospital == false) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Not a Hospital request !!!' }] });
		}
		const user = await User.findOne({ phone });
		let profile = await Profile.findOne({ user: user.id });
		client.verify
			.services(sid)
			.verificationChecks.create({ to: phone, code: code })
			.then((verification_check) => {
				if (verification_check.status == 'approved') {
					profile.isCreditUsageVerified = true;
					profile.save();
					return res.status(200).json(verification_check.status);
				}
				return res.status(408).send('Incorrect OTP');
			})
			.catch((err) => {
				console.error(err);
				return res.status(408).send('Incorrect OTP');
			});
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route POST /api/hospital/billing/:id/verifyBenificiaryOtp
// @desc  verify otp to use credits
// @access Private hospital access only
const verifyBenificiaryOtp = async (req, res, next) => {
	const { phone, code } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const request = await BillingRequest.findById(req.params.id);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
		if (request.isHospital == false) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Not a Hospital request!!!' }] });
		}
		const user = await User.findOne({ phone });
		let profile = await Profile.findOne({ user: user.id });
		if (!profile.benificiary.bphone) {
			return res
				.status(404)
				.json({ errors: [{ msg: 'No Benificary Found!!' }] });
		}
		const bPhone = profile.benificiary.bphone;
		client.verify
			.services(sid)
			.verificationChecks.create({ to: bPhone, code: code })
			.then((verification_check) => {
				if (verification_check.status == 'approved') {
					profile.isCreditUsageVerified = true;
					profile.save();
					return res.status(200).json(verification_check.status);
				}
				return res.status(408).send('Incorrect OTP');
			})
			.catch((err) => {
				console.error(err);
				return res.status(408).send('Incorrect OTP');
			});
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

// @route POST /api/hospital/billing/:id
// @desc  verify otp to use credits
// @access Private hospital access only
const useCredits = async (req, res, next) => {
	const { phone } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		let credits = 0;
		const user = await User.findOne({ phone });
		let profile = await Profile.findOne({ user: user.id });
		let bill = await Billing.findOne({
			request: req.params.id,
			hospital: req.hospital.id,
		});
		const request = await BillingRequest.findById(req.params.id);
		if (!profile.isCreditUsageVerified) {
			return res.status(401).json({ msg: 'Authorization denied' });
		}
		if (profile.credits == 0) {
			return res
				.status(400)
				.json({ msg: "You don't have enough credits to use" });
		}
		if (profile.credits > 500) {
			credits = 500;
		} else {
			credits = profile.credits;
		}
		if (bill.subTotal >= credits) {
			bill.grandTotal = bill.subTotal - credits;
		} else {
			bill.grandTotal = 0;
			credits = bill.subTotal;
		}
		profile.credits -= credits;
		bill.credits = credits;
		profile.isCreditUsageVerified = false;
		await profile.save();
		await bill.save();
		const { bookings } = request;
		bookings.forEach(async (item) => {
			await Booking.findByIdAndDelete(item);
		});
		request.status = true;
		await request.save();
		return res.status(200).json(bill);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route POST /api/hospital/billing/:id/skip
// @desc  Create bill without credits
// @access Private hospital access only
const skipCredits = async (req, res, next) => {
	try {
		const request = await BillingRequest.findById(req.params.id);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No request found!' }] });
		}
		if (request.isHospital == false) {
			return res
				.status(404)
				.json({ errors: [{ msg: 'Not a Hospital request!!!' }] });
		}
		const { bookings } = request;
		bookings.forEach(async (item) => {
			await Booking.findByIdAndDelete(item);
		});
		request.status = true;
		await request.save();
		const bill = await Billing.findOne({ request: req.params.id });
		if (bill.isHospital == false) {
			return res
				.status(404)
				.json({ errors: [{ msg: 'Not a Hospital request!' }] });
		}
		return res.status(200).json(bill);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getHospitalBillingRequests = getHospitalBillingRequests;
exports.gethospitalBillingRequestById = gethospitalBillingRequestById;
exports.rejectRequest = rejectRequest;
exports.getCredits = getCredits;
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
exports.useCredits = useCredits;
exports.sendBenificiaryOtp = sendBenificiaryOtp;
exports.verifyBenificiaryOtp = verifyBenificiaryOtp;
exports.skipCredits = skipCredits;
