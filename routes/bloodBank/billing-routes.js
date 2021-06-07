const router = require('express').Router(),
	auth = require('../../middleware/bloodBankAuth'),
	updateInventory = require('../../middleware/inventory'),
	{ check } = require('express-validator'),
	billingController = require('../../controllers/bloodBank-controllers/billingController');

router.get('/', auth, updateInventory, billingController.getBillingRequests);
router.get('/:id', auth, billingController.getRequestById);
router.delete('/:id', auth, updateInventory, billingController.rejectRequest);
router.get('/:id/getCredits/:phone', auth, billingController.getCredits);
router.post(
	'/:id/useCredits',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	auth,
	billingController.sendOtp
);
router.post(
	'/:id/verifyOtp',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	check('code', 'Enter valid otp').isLength({ min: 6, max: 6 }),
	auth,
	billingController.verifyOtp
);
router.post(
	'/:id',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	auth,
	billingController.useCredits
);
router.post('/:id/skip', auth, billingController.skipCredits);

module.exports = router;
