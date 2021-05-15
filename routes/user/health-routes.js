const router = require('express').Router(),
    healthController = require('../../controllers/user-controllers/health-controllers'),
    auth = require('../../middleware/userAuth');


router.post('/:id',auth,healthController.addHealthInfo);
router.get('/',auth,healthController.getDonation);


module.exports = router;