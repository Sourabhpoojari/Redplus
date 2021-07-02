const bloodDonateController = require('../../controllers/user-controllers/donateblood-controllers'),
router= require('express').Router(),
    auth = require('../../middleware/userAuth');

router.get('/donateblood',auth,bloodDonateController.donateBloodInfo);

router.get('/listofBloodBanks',auth,bloodDonateController.bloodBanklist);

module.exports = router;

