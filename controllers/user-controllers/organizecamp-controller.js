const { validationResult } = require('express-validator'),
	campSheduleRequest = require('../../models/admin/requests/campsheduleReuestSchema'),
	Camp = require('../../models/camp/camp'),
	moment = require('moment'),
	Profile = require('../../models/user/profileSchema'),
	BloodBankProfile = require('../../models/bloodBank/bloodBank/profile');

//  @route /api/user/camp
// @desc  post campshedule request form
// @access private
const campRequest = async (req, res, next) => {
	let {
		address,
		title,
		date,
		timefrom,
		timeto,
		donations,
		organization,
		requestForm,
		poster,
		bloodBanks,
		campLat,
		campLng,
	} = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const profile = await Profile.findOne({ user: req.user.id });
	if (!profile) {
		return res
			.status(400)
			.json({ errors: [{ msg: 'Please complete your profile!!' }] });
	}
	try {
		const request = await new campSheduleRequest({
			orgainizer: req.user.id,
			address,
			title,
			date: moment(date).format('DD-MM-YYYY'),
			timefrom: moment(timefrom, 'HH:mm').format('hh:mm A'),
			timeto: moment(timeto, 'HH:mm').format('hh:mm A'),
			donations,
			organization,
			requestForm,
			poster,
			bloodBanks,
		});
		if (campLat && campLng) {
			request.location.coordinates = [campLat, campLng];
			request.location.type = 'Point';
		}
		await request.save();
		return res.status(200).json(request);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//  @route GET /api/user/camp
// @desc  GET camps
// @access private - user access only
const getCamps = async (req, res, next) => {
	try {
		let camps = await Camp.find();
		camps = camps.filter((camp) => camp.date >= moment().format('DD-MM-YYYY'));
		return res.status(200).json(camps);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

//  @route GET /api/user/bloodBanks
// @desc get bloodBank list
// @access Private
const getBloodBanks = async (req, res, next) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		if (!profile) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Please complete your profile!!' }] });
		}
		const bloodbank = await BloodBankProfile.find();
		if (!bloodbank) {
			return res
				.status(404)
				.json({ errors: [{ msg: 'No bloodBanks found!' }] });
		}
		return res.status(200).json(bloodbank);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

exports.campRequest = campRequest;
exports.getBloodBanks = getBloodBanks;
exports.getCamps = getCamps;
