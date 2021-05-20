const DonorRequest = require('../../models/bloodBank/request/userRequestSchema'),
	Profile = require('../../models/user/profileSchema');
User = require('../../models/user/userSchema');
Health = require('../../models/user/healthInfoSchema');

//  @route /api/bloodBank/requests/donorRequestso
// @desc get Donor requests
// @access Private - blood bank access only
const getDonorRequests = async (req, res, next) => {
	let request;
	try {
		request = await DonorRequest.find().populate('user', [
			'name',
			'phone',
			'profileImage',
		]);
		if (!request) {
			return res.status(404).json({ msg: 'No requests found!' });
		}
		return res.status(200).json({ request });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server error!');
	}
};

//  @route /api/user/:id
// @desc  get user info
// @access bloodbank
const getDonorById = async (req, res, next) => {
	let donor, user;
	try {
		donor = await Profile.findOne({ user: req.params.id }).populate('user', [
			'phone',
		]);

		if (!donor) {
			return res.status(400).json({ msg: 'Profile not found!' });
		}
		return res.status(200).json(donor);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/bloodbank/request/acceptdonationrequest/:req_id
// @desc POST accept donation shedule request
// @access Private - bloodbank access only
const acceptdonorRequest = async (req, res, next) => {
	let request;
	try {
		//console.log({user:req.params.id.user});
		request = await DonorRequest.findOne({ user: req.params.id.user });
		if (!request) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Donation Request not found!' }] });
		}

		return res.status(200).json({ msg: 'Request accepted' });
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/admin/campsheduleRequests/:req_id
// @desc DELETE reject camp shedule request
// @access Private - admin access only
const rejectDonorRequest = async (req, res, next) => {
	let request;
	try {
		request = await DonorRequest.findOne({ user: req.params.id.user });
		health = await Health.findOne({ user: req.params.id });

		if (!request) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Donation request not found!' }] });
		}
		await request.delete();
		await health.delete();
		return res.status(200).json({ msg: 'Request rejected!' });
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

exports.getDonorRequests = getDonorRequests;
exports.getDonorById = getDonorById;
exports.acceptdonorRequest = acceptdonorRequest;
exports.rejectDonorRequest = rejectDonorRequest;
