const hospitalRequest = require('../../models/admin/requests/hospitalRequestSchema'),
	bcrypt = require('bcryptjs'),
	Hospital = require('../../models/hospital/hospital/hospital'),
	jwt = require('jsonwebtoken'),
	Notification = require('../../models/notification/notification'),
	BloodRequest = require('../../models/bloodBank/request/bloodrequestSchema'),
	BillingRequest = require('../../models/bloodBank/request/billingRequestSchema'),
	Bill = require('../../models/bloodBank/billing/billingSchema'),
	config = require('config'),
	{ validationResult } = require('express-validator'),
	HospitalProfile = require('../../models/hospital/hospital/profile');

//  @route /api/hospital/signup request
// @desc  post hospital signup request
// @access Public
const signUpRequest = async (req, res, next) => {
	const {
		hospitalName,
		hospitalEmail,
		hospitalAddress,
		hospitalPhone,
		hospitalRegistrationNumber,
		hospitalLat,
		hospitalLng,
		hospitalRegistrationDocument,
	} = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		let request = await hospitalRequest.findOne({ hospitalEmail });
		if (request) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Hospital already exists!' }] });
		}
		request = await new hospitalRequest({
			hospitalName,
			hospitalEmail,
			hospitalAddress,
			hospitalPhone,
			hospitalRegistrationNumber,
			hospitalRegistrationDocument,
		});
		if (hospitalLng && hospitalLat) {
			// request.location.coordinates.append(hospitalLat,hospitalLng);
			request.location.coordinates = [hospitalLat, hospitalLng];
		}
		await request.save();
		return res.status(200).json(request);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//@route /api/hospital/signup
// @desc put hospital signup for login details
// @access Public
const setPassword = async (req, res, next) => {
	const { password } = req.body;
	let hospital;
	try {
		const token = req.header('x-auth-token');
		if (!token) {
			return res
				.status(401)
				.json({ msg: 'No token found, authorization denied' });
		}
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		hospital = await Hospital.findById(decoded.hospital.id);
		if (!hospital) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'You need to register before login!' }] });
		}
		const salt = await bcrypt.genSalt(10);
		hospital.password = await bcrypt.hash(password, salt);
		await hospital.save();
		return res.status(201).json('Your password is sucessfully set!');
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//@route /api/hospital/logIn
// @desc put hospital  login
// @access Public

const logIn = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { email, password } = req.body;
	try {
		const hospital = await Hospital.findOne({ email });
		if (!hospital) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'You need to register before login!' }] });
		}
		// check password
		const match = await bcrypt.compare(password, hospital.password);
		if (!match) {
			return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] });
		}
		// setting jwt
		const payload = {
			hospital: {
				id: hospital.id,
			},
		};
		jwt.sign(
			payload,
			config.get('jwtSecret'),
			{ expiresIn: '7d' },
			(err, token) => {
				if (err) throw err;
				res.status(200).json({ token });
			}
		);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//@route /api/hospital/profile
// @desc get hospital profile
// @access Private hospital access only
const getProfile = async (req, res, next) => {
	try {
		const profile = await HospitalProfile.findOne({
			hospital: req.hospital.id,
		});
		if (!profile) {
			return res.status(400).json({ msg: 'Profile not found!' });
		} else {
			res.json(profile);
		}
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found!' });
		}
		res.status(500).send('Server error');
	}
};

//@route /api/hospital/dashboard
// @desc get hospital dashboard info
// @access Private hospital access only
const getDashboard = async (req, res, next) => {
	try {
		const pendingRequest = await (
				await BloodRequest.find({
					hospital: req.hospital.id,
				})
			).length,
			acceptedRequest = await (
				await BillingRequest.find({ hospital: req.hospital.id })
			).length,
			totalRequests = await (
				await Bill.find({ hospital: req.hospital.id })
			).length;
		return res
			.status(200)
			.json({ pendingRequest, acceptedRequest, totalRequests });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/hospital/getNotification
// @desc  get blood bank notifications
// @access Private - authorized bloodbank access only
const getNotification = async (req, res, next) => {
	try {
		const notification = await Notification.find({
			hospital: req.hospital.id,
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

//  @route /api/hospital/getAllNotifications
// @desc  get all user notifications
// @access Private - authorized bloodbank access only
const getAllNotifications = async (req, res, next) => {
	try {
		const notifications = await Notification.find({
			hospital: req.hospital.id,
		});
		return res.status(200).json(notifications);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};
//  @route /api/hospital/bloodRequets
// @desc  get all hospital blood requests
// @access Private - authorized bloodbank access only
const getBloodRequests = async (req, res, next) => {
	try {
		const requests = await BloodRequest.find({
			hospital: req.hospital.id,
		});
		return res.status(200).json(requests);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.signUpRequest = signUpRequest;
exports.setPassword = setPassword;
exports.logIn = logIn;
exports.getProfile = getProfile;
exports.getDashboard = getDashboard;
exports.getNotification = getNotification;
exports.getAllNotifications = getAllNotifications;
exports.getBloodRequests = getBloodRequests;
