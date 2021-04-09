const router= require('express').Router(),
    Primarytest  = require("../../controllers/bloodbank-Controllers/primarytest-controllers"),
    {check}= require('express-validator');
    auth = require('../../middleware/bloodBankAuth');

router.post('/primaryTest/:user_id',auth,
        check('weight','Enter a valid weight').exists(),
        check('pulse','Enter a valid pulse').exists(),
        check('hb','Enter a valid hb').exists(),
        check('bp','Enter a valid bp').exists(),
        check('tempreture','Enter a valid tempreture').isEmpty(),
Primarytest.primarytest);

module.exports=router;


