const router = require('express').Router(),
    healthController = require('../../controllers/user-controllers/health-controllers'),
    auth = require('../../middleware/userAuth');


router.post('/',auth,healthController.addHealthInfo);
router.get('/:user_id',auth,healthController.getDonation);


module.exports = router;