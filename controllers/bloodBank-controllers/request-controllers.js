const DonorRequest = require('../../models/bloodBank/request/userRequestSchema'),
	Profile = require('../../models/user/profileSchema'),
	User = require('../../models/user/userSchema'),
	Health = require('../../models/user/healthInfoSchema'),
	BloodReuests = require('../../models/user/bloodRequestFormSchema'),
	BloodRequestedDonor = require('../../models/bloodBank/request/bloodrequestSchema'),
	moment = require('moment');

//  @route /api/bloodBank/requests/donorRequests
// @desc get Donor requests
// @access Private - blood bank access only
const getDonorRequests = async (req, res, next) => {
	let request;
	try {
		request = await DonorRequest.find().populate('donor', [
			'name',
			'phone',
			'profileImage',
		]);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
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
	let donor, request;
	try {
		request = await DonorRequest.findById(req.params.req_id).populate('user', [
			'phone',
			'ProfileImage',
		]);

		donor = await Profile.findOne({ user: request.donor }).populate('user', [
			'phone',
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

//  @route /api/bloodbank/request/acceptdonationrequest/:req_id
// @desc POST accept donation shedule request
// @access Private - bloodbank access only
const acceptdonorRequest = async (req, res, next) => {
	let request;
	try {
		//console.log({user:req.params.id.user});
		request = await DonorRequest.findById(req.params.req_id);
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
	let phone;
	try {
		//phone= await User.findOne({user:req.params.id.user});
		//console.log(phone.phone);
		request = await DonorRequest.findById(req.params.req_id);

		health = await Health.findOne({ user: request.donor });

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

//  @route /api/bloodBank/requests/bloodRequests
// @desc get blood requests
// @access Private - blood bank access only
const getBloodRequests = async (req, res, next) => {
	let request;
	try {
		request = await BloodReuests.find().populate('donor', [
			'name',
			'phone',
			'profileImage',
		]);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
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
const getBloodRequestById = async (req, res, next) => {
	let donor, request;
	try {
		request = await BloodReuests.findById(req.params.req_id);

		donor = await Profile.findOne({ user: request.donor }).populate('user', [
			'phone',
		]);

		if (!donor) {
			return res.status(400).json({ errors: [{ msg: 'Profile not found!' }] });
		}
		return res.status(200).json({ request, donor });
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/bloodbank/request/acceptdonationrequest/:req_id
// @desc POST accept donation shedule request
// @access Private - bloodbank access only
const acceptBloodRequest = async (req, res, next) => {
	let request, profile;
	try {
		//console.log({user:req.params.id.user});
		request = await BloodReuests.findById(req.params.req_id);
		if (!request) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Blood Request not found!' }] });
		}

		const {
			pateintName,
			hospitalName,
			age,
			bloodGroup,
			RequestDate,
			wbc,
			wholeBlood,
			platelet,
			plasma,
			sdPlatlet,
			prbc,
			ffp,
			cryo,
			sprbc,
			sdPlasma,
		} = request;
		profile = await new BloodRequestedDonor({
			donor: request.donor,
			bloodBank: req.bloodBank.id,
			RequestDate,
			pateintName,
			hospitalName,
			age,
			bloodGroup,
			wbc,
			wholeBlood,
			platelet,
			plasma,
			sdPlatlet,
			prbc,
			ffp,
			cryo,
			sprbc,
			sdPlasma,
		});

		await profile.save();
		await request.delete();

		return res.status(200).json({ msg: 'Request accepted' });
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/admin/campsheduleRequests/:req_id
// @desc DELETE reject camp shedule request
// @access Private - admin access only
const rejectBloodRequest = async (req, res, next) => {
	let request;
	try {
		request = await BloodReuests.findById(req.params.req_id);
		if (!request) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Blood request not found!' }] });
		}
		await request.delete();
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
exports.getBloodRequests = getBloodRequests;
exports.getBloodRequestById = getBloodRequestById;
exports.acceptBloodRequest = acceptBloodRequest;
exports.rejectBloodRequest = rejectBloodRequest;
