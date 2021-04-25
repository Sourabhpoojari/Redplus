const router= require('express').Router(),
    testControllers  = require("../../controllers/bloodBank-controllers/testControllers"),
    {check}= require('express-validator'),
    auth = require('../../middleware/bloodBankAuth');
   // { isDate } = require('moment');

    router.post('/primaryTest/:user_id',auth,
            check('weight','Enter a valid weight').exists(),
            check('pulse','Enter a valid pulse').exists(),
            check('hb','Enter a valid hb').exists(),
            check('bp','Enter a valid bp').exists(),
            check('tempreture','Enter a valid tempreture').isEmpty(),
            check('bagnumber','Enter a valid bagnumber').exists().isLength({min:6}),
            testControllers.primaryTest);
    
    router.post('/bloodtestReport/:user_id',auth,
    check('typeOfBag','Enter a valid type of bag').exists(),
    check('quantity','Enter a valid quantity').exists(),
    check('bgroup','Enter a valid blood group').exists(),
    check('batch','Enter a valid batch').exists(),
    check('segNumber','Enter a valid segment').exists(),
    check('rbcCount','Enter a valid rbc Count').exists(),
    check('wbcCount','Enter a valid wbc Count ').exists(),
    check('plateCount','Enter a valid platelet Count').exists(),
    check('hemoglobinCount','Enter a valid hemoglobin Count').exists(),
    check('hematocrit','Enter a valid hematocrit count').exists(),
    check('bglucose','Enter a valid blood bglucose count ').exists(),
    check('anyDiseases','Choose any disease').exists(),
    testControllers.bloodTestReport);
    


    router.post('/bagNumber/:user_id',auth,check('bagNumber','Bag Number is required!').exists(),testControllers.postBagNumber);
    
    module.exports = router;
    
    
    

