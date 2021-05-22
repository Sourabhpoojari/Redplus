const findBloodController = require('../../controllers/user-controllers/findblood-controllers'),
	router = require('express').Router(),
	auth = require('../../middleware/userAuth');

router.get('/nearbyblooodbank',auth,findBloodController.getnearbybloodBank);

router.get('/:component/:bgroup',auth,findBloodController.getBloodBlanks);

module.exports = router;
