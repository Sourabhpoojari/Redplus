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
		if (!profile) {
			return res.status(401).json({ msg: 'Please fill your Profile before donation' });
		}
		if (user.donorTicket) {
			try {
				const ticket = jwt.verify(user.donorTicket, config.get('DONOR_TICKET'));
				if (ticket) {
					return res.status(401).json({ msg: 'Authorization denied' });
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					req.user = decoded.user;
					next();
				} else {
					console.error(err);
					return res.status(500).send('Server error');
				}
			}
		} else {
			req.user = decoded.user;
			next();
		}
	} catch (err) {
		console.error(err);
		res.status(401).json({ msg: 'Token is not valid' });
	}
};
