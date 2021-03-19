const router= require('express').Router(),
bloodbankControllers = require('../../controllers/bloodbank-controllers/bloodbank-controllers'),
{check}= require('express-validator');

router.post('/signUp',check('bname','Enter a valid blood bank name').not().isEmpty(),
check('btype','Please select one option').not().isEmpty(),
check('baddress','Enter a valid address').not().isEmpty(),
check('email','Enter a valid email').isEmail(),
check('phone','Enter a valid phone').isMobilePhone(),
check('password','password must contain atleast 6 characters').isLength({min:6}),
check('bregnumber','Enter a valid reg number').isLength({min:11}),
check('bfile','select valid file formate(pdf,docs,jpeg,png)').not().isEmpty(),
check('baccredation','please select one option').not().isEmpty(),
bloodbankControllers.signUp);

router.post('/logIn',
check('email','Please enter a valid email address').isEmail(),
check('password','password is required').exists(),
bloodbankControllers.logIn
);

module.exports= router;