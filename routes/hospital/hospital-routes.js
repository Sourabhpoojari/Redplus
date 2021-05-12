const router = require('express').Router(),
{check} = require('express-validator'),
hospitalController = require('../../controllers/hospital-controllers/hospital-controllers'),
isHospital = require('../../middleware/hospitalAuth');


router.post('/signUpRequest',
check('hospitalName','Hospital name is required!').not().isEmpty(),
check('hospitalEmail','Enter a valid email-id').isEmail(),
check('hospitalAddress','Hospital address is required!').not().isEmpty(),
check('hospitalRegistrationNumber','Enter a valid Registration number'),
// check('hospitalLat','Lattitude value is required').isEmpty(),
// check('hospitalLng','Longitude value is required!').isEmpty(),
check('hospitalPhone','Enter a valid phone number!').isLength({min:13,max:13}).isMobilePhone(),
hospitalController.signUpRequest);

router.put('/signUp',
check('email','Please enter a valid email address').isEmail(),
check('password','password is required').exists(),
hospitalController.setPassword
);

router.post('/logIn',
check('email','Please enter a valid email address').isEmail(),
check('password','password is required').exists(),
hospitalController.logIn
);


router.get('/profile',isHospital,hospitalController.getProfile);
module.exports = router;