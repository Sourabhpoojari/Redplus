const BillingControllers = require('../../controllers/hospital-controllers/billing-controllers'),
	{ check } = require('express-validator'),
	router = require('express').Router(),
	auth = require('../../middleware/hospitalAuth');

router.get('/getBillings', auth, BillingControllers.getHospitalBillingRequests);
router.get(
	'/getBillings/:id',
	auth,
	BillingControllers.gethospitalBillingRequestById
);
router.delete(
	'/rejectBillingRequest/:id',
	auth,
	BillingControllers.rejectRequest
);
router.get('/:id/getCredits/:phone', auth, BillingControllers.getCredits);
router.post(
	'/:id/useCredits',

	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	auth,
	BillingControllers.sendOtp
);

router.post(
	'/:id/useCreditsByBenificiary',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	auth,
	BillingControllers.sendBenificiaryOtp
);

router.post(
	'/:id/verifyBenificiaryOtp',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	check('code', 'Enter valid otp').isLength({ min: 6, max: 6 }),
	auth,
	BillingControllers.verifyBenificiaryOtp
);

router.post(
	'/:id/verifyOtp',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	check('code', 'Enter valid otp').isLength({ min: 6, max: 6 }),
	auth,
	BillingControllers.verifyOtp
);
router.post(
	'/:id',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	auth,
	BillingControllers.useCredits
);

router.post('/:id/skip', auth, BillingControllers.skipCredits);

module.exports = router;
