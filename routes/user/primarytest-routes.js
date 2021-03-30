const router= require('express').Router(),
    Primarytest  = require("../../controllers/bloodbank-Controllers/primarytest-controllers"),
    {check}= require('express-validator');


router.post('/primarytest/',check('weight','Enter a valid weight').isNumeric().isEmpty(),
        check('pulse','Enter a valid pulse').isNumeric().isEmpty(),
        check('hb','Enter a valid hb').isNumeric().isEmpty(),
        check('bp','Enter a valid bp').isNumeric().isEmpty(),
        check('tempreture','Enter a valid tempreture').isNumeric().isEmpty(),
Primarytest.primarytest);

module.exports=router;


