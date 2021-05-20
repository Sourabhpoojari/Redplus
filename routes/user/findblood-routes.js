const findBloodController = require('../../controllers/user-controllers/findblood-controllers'),
router= require('express').Router(),
{check}= require('express-validator'),
    auth = require('../../middleware/userAuth');

router.post('/nearbyblooodbank',auth,check('lat','Please Give Latitude value').exists(),
check('lang','Please Give Langitude value ').exists(),findBloodController.getnearbybloodBank);


module.exports = router;
