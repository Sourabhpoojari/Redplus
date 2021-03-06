const router = require('express').Router(),
	testControllers = require('../../controllers/bloodBank-controllers/testControllers'),
	{ check } = require('express-validator'),
	auth = require('../../middleware/bloodBankAuth'),
	updateInventory = require('../../middleware/inventory');
// { isDate } = require('moment');

router.post(
	'/primaryTest/:req_id',
	auth,
	check('weight', 'Enter a valid weight').exists(),
	check('pulse', 'Enter a valid pulse').exists(),
	check('hb', 'Enter a valid hb').exists(),
	check('bp', 'Enter a valid bp').exists(),
	check('tempreture', 'Enter a valid tempreture').isEmpty(),
	testControllers.primaryTest
);

router.post(
	'/bloodtestReport/:request_id',
	auth,
	updateInventory,
	check('bgroup', 'Enter a valid blood group').exists(),
	check('segNumber', 'Enter a valid segment').exists(),
	check('rbcCount', 'Enter a valid rbc Count').exists(),
	check('wbcCount', 'Enter a valid wbc Count ').exists(),
	check('plateCount', 'Enter a valid platelet Count').exists(),
	check('hemoglobinCount', 'Enter a valid hemoglobin Count').exists(),
	check('hematocrit', 'Enter a valid hematocrit count').exists(),
	check('bglucose', 'Enter a valid blood bglucose count ').exists(),
	check('systrolic', 'Systrolic value is required!'),
	check('diastolic', 'Diastolic value is required!'),
	testControllers.testReportAndCredits
);

router.post(
	'/bagNumber/:req_id',
	auth,
	check('bagNumber', 'Bag Number is required!').exists(),
	testControllers.postBagNumber
);

router.get('/bagNumbers',auth,testControllers.getDonorBagNumber);
router.get('/bagNumbers/:req_id',auth,testControllers.getDonorById);


module.exports = router;
