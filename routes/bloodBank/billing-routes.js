const router = require('express').Router(),
	auth = require('../../middleware/bloodBankAuth'),
	updateInventory = require('../../middleware/inventory'),
	billingController = require('../../controllers/bloodBank-controllers/billingController');

router.get('/', auth, billingController.getBillingRequests);
router.delete('/:id', auth, updateInventory, billingController.rejectRequest);
module.exports = router;
