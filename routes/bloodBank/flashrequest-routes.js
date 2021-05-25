const router = require('express').Router(),
	{ check } = require('express-validator'),
	FlashRequest = require('../../controllers/bloodBank-controllers/flashRequest-controller'),
	auth = require('../../middleware/bloodBankAuth');

router.post(
	'/',
	auth,
	check('lat', 'Please Give Latitude value').exists(),
	check('lang', 'Please Give Langitude value ').exists(),
	FlashRequest.flashRequest
);

module.exports = router;
