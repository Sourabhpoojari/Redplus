const router = require('express').Router(),
	{ check } = require('express-validator'),
	FlashRequest = require('../../controllers/bloodBank-controllers/flashRequest-controller'),
	auth = require('../../middleware/bloodBankAuth');

router.post('/', auth, FlashRequest.flashRequest);

module.exports = router;
