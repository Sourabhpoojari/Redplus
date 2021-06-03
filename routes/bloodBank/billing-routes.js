const router = require('express').Router(),
	auth = require('../../middleware/bloodBankAuth'),
	billingController = require('../../controllers/bloodBank-controllers/billingController');

router.get('/', auth, billingController.getBillingRequests);

module.exports = router;
