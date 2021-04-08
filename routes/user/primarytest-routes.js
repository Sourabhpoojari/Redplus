const router= require('express').Router(),
    Primarytest  = require("../../controllers/bloodbank-Controllers/primarytest-controllers"),
    {check}= require('express-validator');


router.post('/',auth,
        //check('weight','Enter a valid weight').isEmpty(),
        //check('pulse','Enter a valid pulse').isEmpty(),
        //check('hb','Enter a valid hb').isEmpty(),
        //check('bp','Enter a valid bp').isEmpty().isNumeric(),
        //check('tempreture','Enter a valid tempreture').exists().isEmpty().isNumeric(),
Primarytest.primarytest);

module.exports=router;


