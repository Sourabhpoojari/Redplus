const router = require('express').Router(),
	userControllers = require('../../controllers/user-controllers/user-controllers'),
	bloodBankController = require('../../controllers/bloodbank-Controllers/bloodBankController'),
	campController = require('../../controllers/camp-controllers/camp-controllers'),
	{ check } = require('express-validator'),
	auth = require('../../middleware/userAuth');

router.post(
	'/phone',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	userControllers.getPhone
);
router.post(
	'/phone/verify',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	check('code', 'Enter valid otp').isLength({ min: 6, max: 6 }),
	userControllers.verifyOtp
);
router.put(
	'/signUp',
	check('name', 'Enter a valid name').not().isEmpty(),
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	// check('password','password must contain atleast 6 characters').isStrongPassword({minLength:6,minLowercase:1,minUppercase:1,minNumbers:1})
	userControllers.signUp
);
router.post(
	'/logIn',
	check('phone', 'Enter a valid phone number')
		.isLength({ min: 13, max: 13 })
		.isMobilePhone(),
	check('password', 'password is required').isLength({ min: 6 }),
	userControllers.logIn
);
router.get('/', auth, userControllers.getUser);

router.get('/bloodbankinfo/:id', auth, bloodBankController.getBloodBankById);

router.get('/campinfo/:id', auth, campController.getCampById);

router.post('/updatelocation', auth, userControllers.updateLocation);
module.exports = router;
