const Profile = require('../models/user/profileSchema'),
	Donation = require('../models/user/donationSchema'),
	User = require('../models/user/userSchema'),
	jwt = require('jsonwebtoken'),
	config = require('config');

module.exports = async (req, res, next) => {
	await next();
	try {
		const { donorTicket } = await User.findById(req.user.id).select(
			'donorTicket'
		);
		if (donorTicket) {
			let credits = 0;
			let profile = await Profile.findOne({ user: req.user.id });
			const donations = await Donation.find({ user: req.user.id });
			donations.forEach((item) => {
				try {
					const ticket = jwt.verify(
						item.expiryTicket,
						config.get('CREDITSECRET')
					);
					if (ticket) {
						credits += item.credits;
					}
				} catch (err) {
					if (err.name == 'TokenExpiredError') {
					} else {
						console.error(err);
					}
				}
			});
			if (profile.credits > credits) {
				profile.credits = credits;
			}
			await profile.save();
			console.log('Credits Updated!');
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Credits Update Failed!' });
	}
};
