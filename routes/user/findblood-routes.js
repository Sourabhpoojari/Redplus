const findBloodController = require('../../controllers/user-controllers/findblood-controllers'),
	router = require('express').Router(),
	{check} = require('express-validator'),
	auth = require('../../middleware/userAuth');

router.get('/nearbyblooodbank',auth,findBloodController.getnearbybloodBank);

router.get('/:component/:bgroup',auth,findBloodController.getBloodBlanks);

router.post('/bloodrequest/:req_id',auth,
check('patientName','Pateint name is required').exists(),
check('hospitalName','Hospital name is required').not().isEmpty(),
check('age','Age is Required').exists(),
check('bloodGroup','BloodGroup is required').exists(),
findBloodController.bloodRequestForm);

module.exports = router;
