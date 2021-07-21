const Donor = require('../../models/user/donorlocationSchema'),
	BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
	FlashRequest = require('../../models/bloodBank/request/flashRequestSchema'),
	Profile = require('../../models/user/profileSchema'),
	{ validationResult } = require('express-validator'),
	fast2sms = require('fast-two-sms'),
	jwt = require('jsonwebtoken'),
	config = require('config');

//  @route /api/bloodbank/flashrequest
// @desc request for donor for blood
// @access Private
const flashRequest = async (req, res, next) => {
	try {
		const { bgroup } = req.body;
		const request = await FlashRequest.findOne({
			bloodBank: req.bloodBank.id,
			bgroup,
		});
		if (request) {
			return res.status(301).send('Request Already Sent!');
		}
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
			}).populate('user', ['phone', 'donorTicket']);
			if (profile) {
				let { phone, donorTicket } = profile.user;
				if (donorTicket) {
					try {
						const ticket = jwt.verify(donorTicket, config.get('DONOR_TICKET'));
					} catch (err) {
						if (err.name == 'TokenExpiredError') {
							phone = phone.slice(3, 13);
							donor.push(parseInt(phone));
						} else {
							console.error(err);
							return res.status(500).send('Server error');
						}
					}
				} else {
					phone = phone.slice(3, 13);
					donor.push(parseInt(phone));
				}
			}
		}
		const text =
			'Urgent Requirement of ' +
			bgroup +
			' blood in ' +
			bloodBankProfile.bloodBankName +
			'  -RedPlus';
		const options = {
			authorization: config.get('FAST2SMS'),
			message: text,
			numbers: donor,
		};
		fast2sms
			.sendMessage(options)
			.then(async (response) => {
				const flash = await new FlashRequest({
					bloodBank: req.bloodBank.id,
					numbers: donor,
					bgroup,
				});
				await flash.save();
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

//  @route GET /api/bloodbank/flashrequest
// @desc get flash requests
// @access Private
const getRequests = async (req, res, next) => {
	try {
		const requests = await FlashRequest.find({ bloodBank: req.bloodBank.id });
		return res.status(200).json(requests);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};
//  @route DELETE /api/bloodbank/flashrequest/:id
// @desc delete flash request
// @access Private
const deleteRequest = async (req, res, next) => {
	try {
		const request = await FlashRequest.findById(req.params.id);
		if (!request) {
			return res.status(404).json({ msg: 'Request Not Found!' });
		}
		const bloodBankProfile = await BloodBankProfile.findOne({
			bloodBank: req.bloodBank.id,
		});
		const { bgroup, numbers } = request;
		const text =
			bgroup +
			' blood is arranged in ' +
			bloodBankProfile.bloodBankName +
			'.    Thank You      -RedPlus';
		const options = {
			authorization: config.get('FAST2SMS'),
			message: text,
			numbers: numbers,
		};
		fast2sms
			.sendMessage(options)
			.then(async (response) => {
				await request.delete();
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
exports.getRequests = getRequests;
exports.deleteRequest = deleteRequest;
