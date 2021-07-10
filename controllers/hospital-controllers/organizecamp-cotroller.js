const { validationResult } = require('express-validator'),
	campSheduleRequest = require('../../models/admin/requests/campsheduleReuestSchema'),
	moment = require('moment'),
	Profile = require('../../models/hospital/hospital/hospital'),
	BloodBank = require('../../models/bloodBank/bloodBank/bloodBank');

//  @route /api/hospital/campshedule
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
	
	try {
       
		const request = await new campSheduleRequest({
			orgainizer: req.hospital.id,
			address,
			title,
			date:moment(date).format('DD-MM-YYYY'),
			timefrom: moment(timefrom, 'HH:mm').format('hh:mm A'),
			timeto: moment(timeto, 'HH:mm').format('hh:mm A'),
			donations,
			organization,
			requestForm,
			poster,
			bloodBanks,
            isHospital:true
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

//  @route GET /api/hospital/bloodBanks
// @desc get bloodBank list
// @access Private
const getBloodBanks = async (req, res, next) => {
	try {
		
		const bloodbank = await BloodBank.find({ isBloodBank: true }).select(
			'-password'
		);
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
