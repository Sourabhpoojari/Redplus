const router = require('express').Router(),
	{ check } = require('express-validator'),
	FlashRequest = require('../../controllers/bloodBank-controllers/flashRequest-controller'),
	auth = require('../../middleware/bloodBankAuth');

router.post('/', auth, FlashRequest.flashRequest);
router.get('/', auth, FlashRequest.getRequests);
router.delete('/:id', auth, FlashRequest.deleteRequest);

module.exports = router;
