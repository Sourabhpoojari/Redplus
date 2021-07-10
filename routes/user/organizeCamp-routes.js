const router = require('express').Router(),
	{ check } = require('express-validator'),
	campOrganizeController = require('../../controllers/user-controllers/organizecamp-controller'),
	auth = require('../../middleware/userAuth');

router.post(
	'/',
	auth,
	check('address', 'Camp Address is required!').not(),
	check('title', 'Camp title is required!').not(),
	check('date', 'Shedule date is required!').not(),
	check('timefrom', 'time from is required!').not(),
	check('timeto', 'time to is required!').not(),
	check('donations', 'Enter a valid capacity').not(),
	check('community', 'Enter a valid community').not(),
	check('organization', 'Enter a reference id').not(),
	check('poster', 'choose valid poster').not(),
	check('requestForm', 'choice request form').not(),
	check('bloodBanks', 'please select bloodbanks').not(),
	check('campLat', 'Lattitude value is required').not(),
	check('campLng', 'Longitude value is required!').not(),

	campOrganizeController.campRequest
);
router.get('/', auth, campOrganizeController.getCamps);

router.get('/bloodBanks', auth, campOrganizeController.getBloodBanks);

module.exports = router;
