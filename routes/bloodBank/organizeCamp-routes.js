const router = require('express').Router(),
	{ check } = require('express-validator'),
	campOrganizeController = require('../../controllers/bloodBank-controllers/organizeCamp-controller'),
	auth = require('../../middleware/bloodBankAuth');

router.post(
	'/',
	auth,
	check('campAddress', 'Camp Address is required!').not(),
	check('campName', 'Camp Name is required!').not(),
	check('campSchedule', 'Shedule date is required!').not(),
	check('capacity', 'Enter a valid capacity').not(),
	check('community', 'Enter a valid community').not(),
	check('referenceId', 'Enter a reference id').not(),
	check('poster', 'choose valid poster').not(),
	check('sponserOrganization', 'Enter a sponserOrganization').not(),
	// check('campLat','Lattitude value is required').isEmpty(),
	// check('campLng','Longitude value is required!').isEmpty(),

	campOrganizeController.campRequest
);

module.exports = router;
