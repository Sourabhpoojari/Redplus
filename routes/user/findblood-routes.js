const findBloodController = require('../../controllers/user-controllers/findblood-controllers'),
<<<<<<< HEAD
router= require('express').Router(),
{check}= require('express-validator'),
    auth = require('../../middleware/userAuth');

router.post('/nearbyblooodbank',auth,check('lat','Please Give Latitude value').exists(),
check('lang','Please Give Langitude value ').exists(),findBloodController.getnearbybloodBank);

=======
	router = require('express').Router(),
	{ check } = require('express-validator'),
	auth = require('../../middleware/userAuth');

router.post(
	'/nearbyblooodbank',
	auth,
	check('lat', 'Please Give Latitude value').exists(),
	check('lang', 'Please Give Langitude value ').exists(),
	findBloodController.getnearbybloodBank
);

router.get('/:component/:bgroup', auth, findBloodController.getBloodBlanks);
>>>>>>> ca5139a81701b136372abacb85ff3af7e8fb0724

module.exports = router;
