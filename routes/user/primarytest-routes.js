const router= require('express').Router(),
    Primarytest  = require("../../controllers/bloodbank-Controllers/primarytest-controllers"),
    {check}= require('express-validator');


router.post('/',check('weight','Enter a valid weight').isEmpty(),
        check('pulse','Enter a valid pulse').isEmpty(),
        check('hb','Enter a valid hb').isEmpty(),
        check('bp','Enter a valid bp').isEmpty(),
        check('tempreture','Enter a valid tempreture').isEmpty(),
Primarytest.primarytest);

module.exports=router;


