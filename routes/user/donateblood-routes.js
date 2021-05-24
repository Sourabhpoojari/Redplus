const bloodDonateController = require('../../controllers/user-controllers/donateblood-controllers'),
router= require('express').Router(),
    auth = require('../../middleware/userAuth');

router.get('/donateblood',auth,bloodDonateController.donateBloodInfo);


module.exports = router;

