const findBloodController = require('../../controllers/user-controllers/findblood-controllers'),
	router = require('express').Router(),
	auth = require('../../middleware/userAuth');

router.get('/nearbyblooodbank',auth,findBloodController.getnearbybloodBank);

router.get('/:component/:bgroup',auth,findBloodController.getBloodBlanks);

router.post('/bloodrequest/:req_id',auth,findBloodController.bloodRequestForm);

module.exports = router;
