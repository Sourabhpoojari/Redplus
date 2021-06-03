const { request } = require('express');

const DonorRequest = require('../../models/bloodBank/request/userRequestSchema'),
	Profile = require('../../models/user/profileSchema'),
	Health = require('../../models/user/healthInfoSchema'),
	BloodRequest = require('../../models/bloodBank/request/bloodrequestSchema'),
	BillingRequest = require('../../models/bloodBank/request/billingRequestSchema'),
	Booking = require('../../models/bloodBank/inventory/bookingSchema'),
	wbcSchema = require('../../models/bloodBank/storage/wbc-schema'),
	Inventory = require('../../models/bloodBank/inventory/inventorySchema'),
	User = require('../../models/user/userSchema');

//  @route /api/bloodBank/requests/donorRequests
// @desc get Donor requests
// @access Private - blood bank access only
const getDonorRequests = async (req, res, next) => {
	try {
		const request = await DonorRequest.find().populate('donor', [
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
	try {
		const request = await DonorRequest.findById(req.params.req_id).populate(
			'user',
			['phone', 'ProfileImage']
		);

		const donor = await Profile.findOne({ user: request.donor }).populate(
			'user',
			['phone']
		);

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
	try {
		//console.log({user:req.params.id.user});
		const request = await DonorRequest.findById(req.params.req_id);
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
	try {
		//phone= await User.findOne({user:req.params.id.user});
		//console.log(phone.phone);
		const request = await DonorRequest.findById(req.params.req_id);

		const health = await Health.findOne({ user: request.donor });

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
	try {
		const request = await BloodRequest.find().populate('donor', [
			'name',
			'phone',
			'profileImage',
		]);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
		}
		return res.status(200).json(request);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server error!');
	}
};

//  @route /api/bloodBank/requests/bloodRequests/:id
// @desc  get request info
// @access bloodbank
const getBloodRequestById = async (req, res, next) => {
	try {
		const request = await BloodRequest.findById(req.params.req_id);
		if (!request) {
			return res.status(404).json({ errors: [{ msg: 'No requests found!' }] });
		}
		 console.log(request.donor);
		// const reqinfo = await User.findOne(request.donor);
		// console.log(reqinfo);
		return res.status(200).json(request);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/bloodbank/request/acceptdonationrequest/:req_id
// @desc POST accept donation shedule request
// @access Private - bloodbank access only
const acceptBloodRequest = async (req, res, next) => {
	try {
		const request = await BloodRequest.findById(req.params.req_id);
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
			WBC,
			WholeBlood,
			Platelet,
			Plasma,
			PRBC,
			FFP,
			Cryoprecipitate,
			SPRBC,
			SDPlatele,
			SDPlasma,
		} = request;
		let inventory = await Inventory.findOne({
			bloodBankID: req.bloodBank.id,
		});
		// Check  inventory
		if (WBC > 0) {
			if (!wbcStatus(inventory, bloodGroup, WBC)) {
				return res.status(422).send('WBC out of stock!');
			}
		}
		if (WholeBlood > 0) {
			if (!wholeStatus(inventory, bloodGroup, WholeBlood)) {
				return res.status(422).send('WholeBlood out of stock!');
			}
		}
		if (Platelet > 0) {
			if (!plateletStatus(inventory, bloodGroup, Platelet)) {
				return res.status(422).send('Platelet out of stock!');
			}
		}
		if (Plasma > 0) {
			if (!plasmaStatus(inventory, bloodGroup, Plasma)) {
				return res.status(422).send('Plasma out of stock!');
			}
		}
		if (PRBC > 0) {
			if (!prbcStatus(inventory, bloodGroup, PRBC)) {
				return res.status(422).send('PRBC out of stock!');
			}
		}
		if (FFP > 0) {
			if (!ffpStatus(inventory, bloodGroup, FFP)) {
				return res.status(422).send('FFP out of stock!');
			}
		}
		if (Cryoprecipitate > 0) {
			if (!cryoStatus(inventory, bloodGroup, Cryoprecipitate)) {
				return res.status(422).send('Cryoprecipitate out of stock!');
			}
		}
		if (SPRBC > 0) {
			if (!sprbcStatus(inventory, bloodGroup, SPRBC)) {
				return res.status(422).send('SPRBC out of stock!');
			}
		}
		if (SDPlatele > 0) {
			if (!sdplateStatus(inventory, bloodGroup, SDPlatele)) {
				return res.status(422).send('SDPlatele out of stock!');
			}
		}
		if (SDPlasma > 0) {
			if (!sdplasmaStatus(inventory, bloodGroup, SDPlasma)) {
				return res.status(422).send('SDPlasma out of stock!');
			}
		}

		// update Inventory
		if (WBC > 0) {
			wbcUpdate(bloodGroup, WBC);
		}
		if (WholeBlood > 0) {
			wholeUpdate(inventory, bloodGroup, WholeBlood);
		}
		if (Platelet > 0) {
			plateletUpdate(inventory, bloodGroup, Platelet);
		}
		if (Plasma > 0) {
			plasmaUpdate(inventory, bloodGroup, Plasma);
		}
		if (PRBC > 0) {
			prbcUpdate(inventory, bloodGroup, PRBC);
		}
		if (FFP > 0) {
			ffpUpdate(inventory, bloodGroup, FFP);
		}
		if (Cryoprecipitate > 0) {
			cryoUpdate(inventory, bloodGroup, Cryoprecipitate);
		}
		if (SPRBC > 0) {
			sprbcUpdate(inventory, bloodGroup, SPRBC);
		}
		if (SDPlatele > 0) {
			sdplateUpdate(inventory, bloodGroup, SDPlatele);
		}
		if (SDPlasma > 0) {
			sdplasmaUpdate(inventory, bloodGroup, SDPlasma);
		}

		const billing = await new BillingRequest({
			donor: request.donor,
			bloodBank: req.bloodBank.id,
			RequestDate,
			pateintName,
			hospitalName,
			age,
			bloodGroup,
			WBC,
			WholeBlood,
			Platelet,
			Plasma,
			PRBC,
			FFP,
			Cryoprecipitate,
			SPRBC,
			SDPlatele,
			SDPlasma,
		});

		await billing.save();
		await request.delete();

		return res.status(200).json(billing);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

// component status functions
const wbcStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.wbc['A+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'A-Ve') {
			if (inventory.wbc['A-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B+Ve') {
			if (inventory.wbc['B+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B-Ve') {
			if (inventory.wbc['B-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.wbc['AB+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.wbc['AB-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O+Ve') {
			if (inventory.wbc['O+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O-Ve') {
			if (inventory.wbc['O-Ve'] < count) {
				return false;
			}
		}
		return true;
	} catch (err) {
		console.error(err.message);
	}
};
const wholeStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.whole['A+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'A-Ve') {
			if (inventory.whole['A-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B+Ve') {
			if (inventory.whole['B+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B-Ve') {
			if (inventory.whole['B-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.whole['AB+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.whole['AB-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O+Ve') {
			if (inventory.whole['O+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O-Ve') {
			if (inventory.whole['O-Ve'] < count) {
				return false;
			}
		}
		return true;
	} catch (err) {
		console.error(err.message);
	}
};
const plateletStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.platelet['A+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'A-Ve') {
			if (inventory.platelet['A-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B+Ve') {
			if (inventory.platelet['B+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B-Ve') {
			if (inventory.platelet['B-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.platelet['AB+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.platelet['AB-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O+Ve') {
			if (inventory.platelet['O+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O-Ve') {
			if (inventory.platelet['O-Ve'] < count) {
				return false;
			}
		}
		return true;
	} catch (err) {
		console.error(err.message);
	}
};
const plasmaStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.plasma['A+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'A-Ve') {
			if (inventory.plasma['A-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B+Ve') {
			if (inventory.plasma['B+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B-Ve') {
			if (inventory.plasma['B-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.plasma['AB+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.plasma['AB-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O+Ve') {
			if (inventory.plasma['O+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O-Ve') {
			if (inventory.plasma['O-Ve'] < count) {
				return false;
			}
		}
		return true;
	} catch (err) {
		console.error(err.message);
	}
};
const prbcStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.rbc['A+Ve'] < count) {
				return false;
			}
			return true;
		}
		if (bgroup == 'A-Ve') {
			if (inventory.rbc['A-Ve'] < count) {
				return false;
			}
			return true;
		}
		if (bgroup == 'B+Ve') {
			if (inventory.rbc['B+Ve'] < count) {
				return false;
			}
			return true;
		}
		if (bgroup == 'B-Ve') {
			if (inventory.rbc['B-Ve'] < count) {
				return false;
			}
			return true;
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.rbc['AB+Ve'] < count) {
				console.log(inventory.rbc['AB+Ve']);
				return false;
			}
			return true;
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.rbc['AB-Ve'] < count) {
				return false;
			}
			return true;
		}
		if (bgroup == 'O+Ve') {
			if (inventory.rbc['O+Ve'] < count) {
				return false;
			}
			return true;
		}
		if (bgroup == 'O-Ve') {
			if (inventory.rbc['O-Ve'] < count) {
				return false;
			}
			return true;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const ffpStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.ffp['A+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'A-Ve') {
			if (inventory.ffp['A-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B+Ve') {
			if (inventory.ffp['B+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B-Ve') {
			if (inventory.ffp['B-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.ffp['AB+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.ffp['AB-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O+Ve') {
			if (inventory.ffp['O+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O-Ve') {
			if (inventory.ffp['O-Ve'] < count) {
				return false;
			}
		}
		return true;
	} catch (err) {
		console.error(err.message);
	}
};
const cryoStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.cryo['A+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'A-Ve') {
			if (inventory.cryo['A-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B+Ve') {
			if (inventory.cryo['B+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B-Ve') {
			if (inventory.cryo['B-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.cryo['AB+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.cryo['AB-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O+Ve') {
			if (inventory.cryo['O+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O-Ve') {
			if (inventory.cryo['O-Ve'] < count) {
				return false;
			}
		}
		return true;
	} catch (err) {
		console.error(err.message);
	}
};
const sprbcStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.sagm['A+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'A-Ve') {
			if (inventory.sagm['A-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B+Ve') {
			if (inventory.sagm['B+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B-Ve') {
			if (inventory.sagm['B-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.sagm['AB+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.sagm['AB-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O+Ve') {
			if (inventory.sagm['O+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O-Ve') {
			if (inventory.sagm['O-Ve'] < count) {
				return false;
			}
		}
		return true;
	} catch (err) {
		console.error(err.message);
	}
};
const sdplateStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.sdplate['A+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'A-Ve') {
			if (inventory.sdplate['A-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B+Ve') {
			if (inventory.sdplate['B+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B-Ve') {
			if (inventory.sdplate['B-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.sdplate['AB+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.sdplate['AB-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O+Ve') {
			if (inventory.sdplate['O+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O-Ve') {
			if (inventory.sdplate['O-Ve'] < count) {
				return false;
			}
		}
		return true;
	} catch (err) {
		console.error(err.message);
	}
};
const sdplasmaStatus = (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			if (inventory.sdplasma['A+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'A-Ve') {
			if (inventory.sdplasma['A-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B+Ve') {
			if (inventory.sdplasma['B+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'B-Ve') {
			if (inventory.sdplasma['B-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB+Ve') {
			if (inventory.sdplasma['AB+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'AB-Ve') {
			if (inventory.sdplasma['AB-Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O+Ve') {
			if (inventory.sdplasma['O+Ve'] < count) {
				return false;
			}
		}
		if (bgroup == 'O-Ve') {
			if (inventory.sdplasma['O-Ve'] < count) {
				return false;
			}
		}
		return true;
	} catch (err) {
		console.error(err.message);
	}
};

// update Inventory
const wbcUpdate = async (bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			// inventory.wbc['A+Ve'] -= count;
			// await inventory.save();

			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.wbc['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.wbc['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.wbc['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.wbc['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.wbc['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.wbc['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.wbc['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const wholeUpdate = async (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			inventory.whole['A+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.whole['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.whole['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.whole['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.whole['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.whole['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.whole['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.whole['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const plateletUpdate = async (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			inventory.platelet['A+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.platelet['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.platelet['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.platelet['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.platelet['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.platelet['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.platelet['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.platelet['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const plasmaUpdate = async (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			inventory.plasma['A+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.plasma['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.plasma['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.plasma['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.plasma['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.plasma['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.plasma['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.plasma['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const prbcUpdate = async (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			inventory.rbc['A+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.rbc['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.rbc['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.rbc['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.rbc['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.rbc['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.rbc['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.rbc['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const ffpUpdate = async (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			inventory.ffp['A+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.ffp['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.ffp['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.ffp['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.ffp['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.ffp['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.ffp['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.ffp['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const cryoUpdate = async (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			inventory.cryo['A+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.cryo['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.cryo['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.cryo['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.cryo['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.cryo['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.cryo['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.cryo['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const sprbcUpdate = async (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			inventory.sagm['A+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.sagm['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.sagm['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.sagm['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.sagm['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.sagm['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.sagm['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.sagm['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const sdplateUpdate = async (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			inventory.sdplate['A+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.sdplate['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.sdplate['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.sdplate['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.sdplate['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.sdplate['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.sdplate['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.sdplate['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
const sdplasmaUpdate = async (inventory, bgroup, count) => {
	try {
		if (bgroup == 'A+Ve') {
			inventory.sdplasma['A+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'A-Ve') {
			inventory.sdplasma['A-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB+Ve') {
			inventory.sdplasma['AB+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'AB-Ve') {
			inventory.sdplasma['AB-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B+Ve') {
			inventory.sdplasma['B+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'B-Ve') {
			inventory.sdplasma['B-Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O+Ve') {
			inventory.sdplasma['O+Ve'] -= count;
			await inventory.save();
			return;
		}
		if (bgroup == 'O-Ve') {
			inventory.sdplasma['O-Ve'] -= count;
			await inventory.save();
			return;
		}
	} catch (err) {
		console.error(err.message);
	}
};
//  @route /api/admin/campsheduleRequests/:req_id
// @desc DELETE reject camp shedule request
// @access Private - admin access only
const rejectBloodRequest = async (req, res, next) => {
	try {
		const request = await BloodReuests.findById(req.params.req_id);
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
