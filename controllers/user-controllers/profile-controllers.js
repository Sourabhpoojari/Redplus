const Profile = require('../../models/user/profileSchema'),
	config = require('config'),
	cloudinary = require('cloudinary'),
	validator = require('aadhaar-validator'),
	{ validationResult } = require('express-validator'),
	CLOUDINARY_API_KEY = config.get('CLOUDINARY_API_KEY'),
	User = require('../../models/user/userSchema'),
	CLOUDINARY_SECRET = config.get('CLOUDINARY_SECRET');

// set-up cloudinary
cloudinary.config({
	cloud_name: 'redplus',
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_SECRET,
});

//  @route /api/user/getprofile
// @desc post user getprofile
// @access Private

const getProfile = async (req, res, next) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['phone']
		);

		if (!profile) {
			return res.status(400).json({ msg: 'Profile not found!' });
		} else {
			return res.json(profile);
		}
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found!' });
		}
		res.status(500).send('Server error');
	}
};

//  @route /api/user/profile
// @desc post user profile
// @access Private
const createProfile = async (req, res, next) => {
	const {
		name,
		fatherName,
		email,
		address,
		gender,
		dateOfBirth,
		aadhaar,
		bloodGroup,
		bName,
		relation,
		bPhone,
		profileImage,
	} = req.body;

	let errors = validationResult(req);
	errors = errors.array();

	if (bName || relation || bPhone) {
		if (!bPhone || bPhone.length !== 13) {
			errors.push({
				value: bPhone,
				msg: 'Enter a valid Benificiary Phone Number',
				param: 'bPhone',
				location: 'body',
			});
		}
		if (!bName) {
			errors.push({
				value: bName,
				msg: 'Benificiary Name is required',
				param: 'bName',
				location: 'body',
			});
		}
		if (!relation) {
			errors.push({
				value: relation,
				msg: 'Benificiary Relation is required',
				param: 'relation',
				location: 'body',
			});
		}
	}

	//var  date = moment(dateOfBirth).format('YYYY-MM-DD');
	// console.log(date);
	if (errors.length !== 0) {
		return res.status(422).json({ errors: errors });
	}

	if (!validator.isValidNumber(aadhaar)) {
		return res.status(422).send('Invalid aadhar number');
	}

	let profile;
	try {
		const profileFields = {
			user: req.user.id,
			name,
			fatherName,
			email,
			address,
			gender,
			dateOfBirth,
			aadhaar,
			bloodGroup,
			profileImage,
		};
		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path);
			profileFields.profileImage = result.secure_url;
		}
		if (bName) {
			profileFields.benificiary = {
				name: bName,
				relation,
				phone: bPhone,
			};
		}

		if (profileImage) {
			let user = await User.findById(req.user.id);
			user.profileImage = profileImage;
			await user.save();
		}
		profile = await Profile.findOne({ user: req.user.id });
		if (profile) {
			profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);
			return res.json(profile);
		}
		profile = new Profile(profileFields);
		await profile.save();

		return res.json(profile);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
};

exports.createProfile = createProfile;
exports.getProfile = getProfile;
