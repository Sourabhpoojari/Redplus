const Health = require('../../models/user/healthInfoSchema'),
	Profile = require('../../models/user/profileSchema'),
	Donation = require('../../models/user/donationSchema'),
	Notification = require('../../models/notification/notification'),
	DonorRequest = require('../../models/bloodBank/request/userRequestSchema'),
	moment = require('moment');

//  @route /api/user/health
// @desc post health info
// @access Private
const addHealthInfo = async (req, res, next) => {
	let {
		isDonated,
		date,
		lastMeal,
		history,
		disease,
		consumptions,
		result,
		isPregnant,
		abortion,
		child,
		periods,
	} = req.body;
	let request;
	try {
		let profile = await Profile.findOne({ user: req.user.id });
		if (profile) {
			const gender = await Profile.findOne({ user: req.user.id }).select(
				'gender'
			);
			if (gender == 'Male' && isPregnant) {
				return res.status(422).send('You cannot be pregnant');
			}

			//Age calculation
			const dob = await Profile.findOne({ user: req.user.id }).select(
				'dateOfBirth'
			);
			const age = moment().diff(dob.dateOfBirth, 'years');
			if (age < 18) {
				return res.status(422).send('Your Age should be Greater Than 18');
			}
			let data = {
				user: req.user.id,
				previousDonation: {
					isDonated,
					date,
				},
				lastMeal,
				history,
				disease,
				consumptions,
				result,
				pregnant: {
					isPregnant,
					abortion,
					child,
					periods,
				},
			};
			if (lastMeal > moment().format('HH:mm')) {
				return res.status(422).send('Please enter valid Time');
			}
			if (moment() >= moment(lastMeal, 'HH:mm').add(2, 'hours')) {
				return res.status(422).send('Please have some food');
			}
			let health;
			health = await Health.findOne({ user: req.user.id });
			if (health) {
				health = await Health.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: data },
					{ new: true }
				);
			} else {
				data = new Health(data);
				await data.save();
			}

			if (
				history.length != 0 ||
				disease.length != 0 ||
				consumptions.length != 0 ||
				isPregnant
			) {
				return res.status(422).send('You cannot donate blood');
			}
			date = new Date(date);
			date.setDate(date.getDate() + 90);
			const current = new Date();
			if (current <= date) {
				return res.status(422).send('You cannot donate blood');
			}

			request = await DonorRequest.findOne({ donor: req.user.id });
			if (request) {
				return res.status(422).send('You already sent Donation Request');
			}

			request = await new DonorRequest({
				donor: req.user.id,
				bloodBank: req.params.bloodBank_id,
			});
			const notification = await Notification({
				bloodBank: req.params.bloodBank_id,
				body: 'New Donation Request',
				status: true,
			});
			await notification.save();
			await request.save();
			return res.status(201).json(data);
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error!');
	}
};
//  @route /api/user/health/:camp_id/:bloodBank_id
// @desc post health info
// @access Private
const campHealthInfo = async (req, res, next) => {
	let {
		isDonated,
		date,
		lastMeal,
		history,
		disease,
		consumptions,
		result,
		isPregnant,
		abortion,
		child,
		periods,
	} = req.body;
	let request;
	try {
		let profile = await Profile.findOne({ user: req.user.id });
		if (profile) {
			const gender = await Profile.findOne({ user: req.user.id }).select(
				'gender'
			);
			if (gender == 'Male' && isPregnant) {
				return res.status(422).send('You cannot be pregnant');
			}

			//Age calculation
			const dob = await Profile.findOne({ user: req.user.id }).select(
				'dateOfBirth'
			);
			const age = moment().diff(dob.dateOfBirth, 'years');
			if (age < 18) {
				return res.status(422).send('Your Age should be Greater Than 18');
			}

			let data = {
				user: req.user.id,
				previousDonation: {
					isDonated,
					date,
				},
				lastMeal,
				history,
				disease,
				consumptions,
				result,
				pregnant: {
					isPregnant,
					abortion,
					child,
					periods,
				},
			};
			//lastMeal = moment(lastMeal, 'HH:mm').format('hh:mm A');
			if (lastMeal > moment().format('HH:mm')) {
				return res.status(422).send('Please enter valid Time');
			}
			if (moment() >= moment(lastMeal, 'HH:mm').add(2, 'hours')) {
				return res.status(422).send('Please have some food');
			}
			let health;
			health = await Health.findOne({ user: req.user.id });
			if (health) {
				health = await Health.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: data },
					{ new: true }
				);
				//    return res.json(health);
			} else {
				data = new Health(data);
				await data.save();
			}

			if (
				history.length != 0 ||
				disease.length != 0 ||
				consumptions.length != 0 ||
				isPregnant
			) {
				return res.status(422).send('You cannot donate blood');
			}
			date = new Date(date);
			date.setDate(date.getDate() + 90);
			const current = new Date();
			if (current <= date) {
				return res.status(422).send('You cannot donate blood');
			}

			request = await DonorRequest.findOne({ donor: req.user.id });
			if (request) {
				return res.status(422).send('You already sent Donation Request');
			}

			request = await new DonorRequest({
				donor: req.user.id,
				bloodBank: req.params.bloodBank_id,
				camp: req.params.camp_id,
				isCamp: true,
			});

			await request.save();
			return res.status(201).json(data);
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error!');
	}
};

//  @route /api/user/prevDonation
// @desc get latest donation info
// @access Private
const getDonation = async (req, res, next) => {
	try {
		let previousDonation = await Donation.findOne({ user: req.user.id }).sort(
			'-donatedOn'
		);

		let gender = await Profile.findOne({ user: req.user.id }).select('gender');

		if (!gender) {
			return res.status(422).send('No profile found');
		}
		if (!previousDonation) {
			return res.json(gender);
		}

		return res.status(201).json({ previousDonation, gender });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server error!');
	}
};

exports.getDonation = getDonation;
exports.addHealthInfo = addHealthInfo;
exports.campHealthInfo = campHealthInfo;
