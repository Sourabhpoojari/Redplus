const router = require('express').Router(),
	auth = require('../../middleware/bloodBankAuth'),
	updateInventory = require('../../middleware/inventory'),
	billingController = require('../../controllers/bloodBank-controllers/billingController');

router.get('/', auth, updateInventory, billingController.getBillingRequests);
router.get('/:id', auth, billingController.getRequestById);
router.delete('/:id', auth, updateInventory, billingController.rejectRequest);
router.get('/:id/getCredits/:phone', auth, billingController.getCredits);
module.exports = router;
