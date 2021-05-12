const router = require('express').Router(),
{check} = require('express-validator'),
bloodBankController = require('../../controllers/bloodBank-controllers/bloodBankController'),
userControllers = require('../../controllers/user-controllers/user-controllers'),
isBloodBank = require('../../middleware/bloodBankAuth');


router.post('/signUpRequest',
check('bloodbankName','Blood bank name is required!').isEmpty(),
check('bloodBankEmail','Enter a valid email-id').isEmail(),
check('bloodBankAddress','Blood bank address is required!').not().isEmpty(),
check('bloodBankRegistrationNumber','Enter a valid Registration number'),
// check('bloodBankLat','Lattitude value is required').isEmpty(),
// check('bloodBankLng','Longitude value is required!').isEmpty(),
check('bloodBankPhone','Enter a valid phone number!').isLength({min:13,max:13}).isMobilePhone(),
bloodBankController.signUpRequest);

router.put('/signUp',
check('email','Please enter a valid email address').isEmail(),
check('password','password is required').exists(),
bloodBankController.setPassword
);

router.post('/logIn',
check('email','Please enter a valid email address').isEmail(),
check('password','password is required').exists(),
bloodBankController.logIn
);

router.get('/profile',isBloodBank,bloodBankController.getProfile);

router.get('/getDonors',isBloodBank,userControllers.getDonors);

router.get('/getDonors/:id',isBloodBank,userControllers.getDonorsById);

module.exports = router;