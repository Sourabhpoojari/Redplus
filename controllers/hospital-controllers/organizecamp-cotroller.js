const { validationResult } = require('express-validator'),
	campSheduleRequest = require('../../models/admin/requests/campsheduleReuestSchema'),
	moment = require('moment'),
	Profile = require('../../models/hospital/hospital/hospital'),
	BloodBankProfile = require('../../models/bloodBank/bloodBank/profile'),
	Camp = require('../../models/camp/camp');

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
			date: moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY'),
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
//  @route GET /api/hospital/camp
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

//  @route /api/user/donateblood/:camp_id
// @desc get bloodBank list based of camps
// @access Private
const getCampbyid = async (req, res, next) => {
	try {
		const camp = await Camp.findById(req.params.camp_id);
		const { bloodBanks } = camp;
		const bloodBankProfiles = [];
		for (let i = 0; i < bloodBanks.length; i++) {
			const profile = await BloodBankProfile.findOne({
				bloodBank: bloodBanks[i],
			});
			bloodBankProfiles.push(profile);
		}
		return res.status(200).json({ camp, bloodBankProfiles });
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
exports.getCamps=getCamps;
exports.getCampbyid=getCampbyid;