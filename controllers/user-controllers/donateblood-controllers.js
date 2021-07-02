const BloodBank = require('../../models/bloodBank/bloodBank/profile'),
	Camp = require('../../models/camp/organizeCampSchema'),
	UserLocation = require('../../models/user/donorlocationSchema');

//  @route /api/user/donateblood
// @desc get bloodBank list based on currrent location
// @access Private
const donateBloodInfo = async (req, res, next) => {
	const { location } = await UserLocation.findOne({ user: req.user.id }).select(
		'location'
	);
	const lat = location.coordinates[0];
	lang = location.coordinates[1];

	try {
		let bloodBank = await BloodBank.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [lat, lang],
					},
					distanceField: 'distance',
					maxDistance: 40000,
					spherical: true,
				},
			},
		]);
		bloodBank.forEach((item) => {
			item.distance = parseFloat(item.distance / 1000).toFixed(2);
		});
		let camps = await Camp.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [lat, lang],
					},
					distanceField: 'distance',
					maxDistance: 75000,
					spherical: true,
				},
			},
		]);

		camps.forEach((item) => {
			item.distance = parseFloat(item.distance / 1000).toFixed(2);
		});

		return res.status(200).json({ bloodBanks: bloodBank, camps: camps });
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

//  @route /api/user/getBloodBank
// @desc get bloodBank list
// @access Private
const bloodBanklist = async(req,res,next) =>{
	try{
	const bloodbank = await BloodBank.find();
	if(!bloodbank){
		return res.status(400).json({ errors: [{ msg: 'No bloodBanks found!' }] });
	}
	return res.status(200).json(bloodbank);
	}
	catch(err){
		console.log(err);
		return res.status(500).send('Server error');
	}
}
exports.donateBloodInfo = donateBloodInfo;
exports.bloodBanklist = bloodBanklist;
