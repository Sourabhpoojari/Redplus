const router = require('express').Router(),
    userControllers = require('../../controllers/user-controllers/user-controllers'),
    {check} = require('express-validator');


router.post('/phone',check('phone','Enter a valid phone number').isLength({min:13,max:13}).isMobilePhone(),userControllers.getPhone);
router.post('/phone/verify',check('phone','Enter a valid phone number').isLength({min:13,max:13}).isMobilePhone(),
check('code','Enter valid otp').isLength({min:6,max:6})
,userControllers.verifyOtp);
router.put('/signUp',check('name','Enter a valid name').not().isEmpty(),
check('phone','Enter a valid phone number').isLength({min:13,max:13}).isMobilePhone(),
    check('password','password must contain atleast 6 characters').isLength({min:6})
    , userControllers.signUp);

module.exports = router;