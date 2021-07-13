const User = require('../../models/user/userSchema'),
	Profile = require('../../models/user/profileSchema'),
	Donation = require('../../models/user/donationSchema'),
	Notification = require('../../models/notification/notification'),
	DonorLocation = require('../../models/user/donorlocationSchema'),
	config = require('config'),
	accountSid = config.get('TWILIO_ACCOUNT_SID1'),
	authToken = config.get('TWILIO_AUTH_TOKEN'),
	sid = config.get('TWILIO_SID'),
	{ validationResult } = require('express-validator'),
	client = require('twilio')(accountSid, authToken),
	bcrypt = require('bcryptjs'),
	jwt = require('jsonwebtoken');

//  @route /api/user/phone
// @desc post user phone number && send OTP
// @access Public
const getPhone = async (req, res, next) => {
	const { phone } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const user = await User.findOne({ phone });
	if (user) {
		return res.status(400).json({
			msg: 'User with this phone number already exists',
		});
	}
	try {
		//   const service = await  client.verify.services.create({friendlyName: 'Red Plus'});
		// console.log(service);
		client.verify
			.services(sid)
			.verifications.create({ to: phone, channel: 'sms' })
			.then((verification) => {
				// console.log(verification);

				return res.status(200).json(verification.status);
			})
			.catch((err) => {
				console.error(err);
				return res.status(408).send('OTP Problem');
			});
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Phone number error!');
	}
};
//  @route /api/user/phone/verify
// @desc post user phone number && verify OTP
// @access Public
const verifyOtp = async (req, res, next) => {
	const { phone, code } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	let user;
	try {
		user = await User.findOne({ phone });
		if (user) {
			return res.status(400).json({
				msg: 'User with this phone number already exists',
			});
		}

		client.verify
			.services(sid)
			.verificationChecks.create({ to: phone, code: code })
			.then((verification_check) => {
				//   console.log(verification_check);
				if (verification_check.status == 'approved') {
					user = new User({ phone });
					user.isVerified = true;
					user.save();
					return res.status(200).json(verification_check.status);
				}
				return res.status(408).send('Incorrect OTP');
			})
			.catch((err) => {
				console.error(err);
				return res.status(408).send('Incorrect OTP');
			});
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server error!');
	}
};

//  @route /api/user/signup
// @desc  User sign-up && put user info
// @access Public
const signUp = async (req, res, next) => {
	const { name, phone, password } = req.body;
	let user;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		user = await User.findOne({ phone });
		if (!user) {
			return res.status(400).json({
				errors: [{ msg: 'Please verify your phone number before signup' }],
			});
		}
		if (user.name != null) {
			return res.status(400).json({ errors: [{ msg: 'User already' }] });
		}

		user.name = name;
		// bcrypt password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();
		// setting jwt
		const payload = {
			user: {
				id: user.id,
			},
		};
		jwt.sign(
			payload,
			config.get('jwtSecret'),
			{ expiresIn: 3600 },
			(err, token) => {
				if (err) throw err;
				return res.status(200).json({ token });
			}
		);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server error!');
	}
};

//  @route /api/user/logIn
// @desc  User login
// @access Public
const logIn = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { phone, password } = req.body;
	let user;
	try {
		user = await User.findOne({ phone });
		if (!user) {
			return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] });
		}
		// check password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] });
		}
		// setting jwt
		const payload = {
			user: {
				id: user.id,
			},
		};
		jwt.sign(
			payload,
			config.get('jwtSecret'),
			{ expiresIn: '7d' },
			(err, token) => {
				if (err) throw err;
				res.status(200).json({ token: token });
			}
		);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/user
// @desc get user
// @access Private
const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.status(201).json(user);
	} catch (err) {
		console.log(err);
		res.status(500).send('cannot get user!');
	}
};

//  @route /api/bloodBank/getDonors
// @desc get list of Donors
// @access Private to bloodbank

const getDonors = async (req, res, next) => {
	try {
		const donor = await Profile.find();
		if (!donor) {
			return res.status(400).json({ msg: 'No donor found!' });
		}

		//console.log(await Profile.find().countDocuments());
		return res.json(donor);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

//  @route /api/bloodbank/getDonors/:id
// @desc get  of details of Donors
// @access Private to bloodbank

const getDonorsById = async (req, res, next) => {
	try {
		let donorinfo = await Profile.findById(req.params.id);
		if (!donorinfo) {
			return res.status(400).json({ msg: 'donor profile not found' });
		}
		const donationinfo = await Donation.findById(req.params.id);
		// if(!donationinfo){
		//     return res.status(200).json({donorinfo});
		// }

		return res.status(200).json({ donorinfo, donationinfo });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

//  @route /api/user/updatelocation
// @desc post update user location
// @access Private to user
const updateLocation = async (req, res, next) => {
	let { lat, lang } = req.body;
	lat = parseFloat(lat);
	lang = parseFloat(lang);

	let donor = {};
	let user;
	let userLoc;
	try {
		donor.user = req.user.id;
		donor.location = {};
		donor.location.type = 'Point';
		donor.location.coordinates = [];
		donor.location.coordinates[0] = lat;
		donor.location.coordinates[1] = lang;
		user = await DonorLocation.findOne({ user: req.user.id });
		if (user) {
			userLoc = await DonorLocation.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: donor },
				{ new: true }
			);
			return res.status(200).json(userLoc);
		}
		userLoc = new DonorLocation(donor);
		await userLoc.save();
		return res.status(200).json(userLoc);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

//  @route /api/user/getNotification
// @desc  get blood bank notifications
// @access Private - authorized bloodbank access only
const getNotification = async (req, res, next) => {
	try {
		const notification = await Notification.find({
			user: req.user.id,
			status: true,
		});
		notification.map(async (item) => {
			item.status = false;
			await item.save();
		});
		return res.status(200).json(notification);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getPhone = getPhone;
exports.verifyOtp = verifyOtp;
exports.signUp = signUp;
exports.logIn = logIn;
exports.getUser = getUser;
exports.getDonors = getDonors;
exports.getDonorsById = getDonorsById;
exports.updateLocation = updateLocation;
exports.getNotification = getNotification;
