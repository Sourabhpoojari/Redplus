const jwt = require('jsonwebtoken'),
	User = require('../models/user/userSchema'),
	Profile = require('../models/user/profileSchema'),
	config = require('config');

module.exports = async (req, res, next) => {
	const token = req.header('x-auth-token');
	// if no token
	if (!token) {
		return res
			.status(401)
			.json({ msg: 'No token found, authorization denied' });
	}
	// verify token
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		const user = await User.findById(decoded.user.id);
		const profile = await Profile.findOne({ user: decoded.user.id });
		if (
			(user.donorTicket &&
				jwt.verify(user.donorTicket, config.get('DONOR_TICKET'))) ||
			!profile
		) {
			return res.status(401).json({ msg: 'Authorization denied' });
		}
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};
