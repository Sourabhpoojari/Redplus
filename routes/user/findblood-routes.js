const findBloodController = require('../../controllers/user-controllers/findblood-controllers'),
	router = require('express').Router(),
	{check} = require('express-validator'),
	auth = require('../../middleware/userAuth');

router.get('/nearbyblooodbank',auth,findBloodController.getnearbybloodBank);

router.get('/:component/:bgroup',auth,findBloodController.getBloodBlanks);

router.post('/bloodrequest/:req_id',auth,
check('pateintName','Pateint is required').not().isEmpty(),
check('hospitalName','Hospital name is required').not().isEmpty(),
check('age','Age is Required').isEmail(),
check('bloodGroup','BloodGroup is required').exists(),
check('wbc','WBC UNIT is required').exists(),
check('wholeBlood','wholeBlood UNIT is required').exists(),
check('platelet',' platelet UNIT is required').isLength({min:12}),
check('plasma','plasma UNIT is required').exists(),
check('sdPlatlet','sdPlatlet UNIT is required').exists(),
check('prbc','prbc UNIT is required').exists(),
check('ffp','ffp UNIT is required').exists(),
check('cryo','cryo UNIT is required').exists(),
check('sprbc','sprbc UNIT is required').exists(),
check('sdPlasma','sdPlasma UNIT is required').exists(),
findBloodController.bloodRequestForm);

module.exports = router;
